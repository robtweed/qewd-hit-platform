# The QEWD HIT Platform Interface to OpenEHR

## OpenEHR Templates

The QEWD HIT Platform focuses on the creation, reading and updating of instances of 
a patient's *Clinical Headings* (eg Allergies, Procedures, Medications, etc),
 represented in an OpenEHR system by *Templates*.

Your OpenEHR system should already include most, if not all, the Templates you require.
If you set up your own OpenEHR system using the Dockerised version of EtherCIS, then you'll
find that it also includes most of the Templates you'll need.

The QEWD HIT Platform does not include the maintenance of Templates (or Archetypes) within its
scope, as there are separate tools available for this.  You may, however, require the help of an
OpenEHR expert if you need to add or maintain Templates.

The *demo* application that is included with the QEWD HIT Platform provides an option for
listing the Templates on your OpenEHR system.  The Template Ids that will be displayed 
are the identifiers used by OpenEHR, eg:

        [
          "IDCR - Adverse Reaction List.v1",
          "IDCR - Medication Statement List.v0",
          ..etc...
        ]

Rather than having to use these often long and cumbersome identifiers, the QEWD HIT Platform
allows you to define a short name for them.  Look in the 
[*/configuration/openehr.json*](https://github.com/robtweed/qewd-hit-platform/blob/master/openehr-ms/configuration/openehr.json)
 file in the *openehr-ms* MicroService folder, and you'll see that two are already defined for you:

        "headings": {
          "allergies": {
            "templateId": "IDCR - Adverse Reaction List.v1"
          },
          "medications": {
            "templateId": "IDCR - Medication Statement List.v0"
          }
        }

You can add further heading shortcut names and link them to the appropriate OpenEHR Template by editing this
file and adding them to the *headings* array.  If you do so, you must restart the *openehr-ms* MicroService
 container for your changes to take effect.

The *demo* application that is included with the QEWD HIT Platform uses and references the *allergies*
Clinical Heading, which, in turn, is referencing the OpenEHR Template: *IDCR - Adverse Reaction List.v1*.


## Accessing OpenEHR Data

Probably the most common way that OpenEHR systems are accessed are:

- to fetch data: queries defined using OpenEHR's AQL query language
- to save or update data: POSTing a JSON file that uses OpenEHR's so-called *Flat JSON* format

### Flat JSON

*Flat JSON* essentially involves collapsing each leaf node in a JSON structure to a key/value pair, 
where the key is a '/'-delimited path representing the path withing the JSON hierarchical structure
for that particular leaf node.  Here's a simple example:

        {
          "foo": {
            "bar": "some value"
          }
        }

would be represented in *Flat JSON* as:

        {
          "/foo/bar": "some value"
        }

A *Flat JSON* document can be unflattened to reconstruct the full JSON hierarchical structure.
In this document, I'll refer to the resulting JSON format as *Unflattened Flat JSON*.


### Flat JSON for Input and Output

Unfortunately, these two commonly used methods for accessing OpenEHR data are not symmetrical: 
knowing the AQL to fetch a patient's data for a particular heading (eg allergies) won't help you
figure out what you need as the corresponding Flat JSON record to save a new allergy record for the patient.

However, it turns out that the instances of a particular heading - eg the allergy records for a 
patient - can be retrieved in the same *Flat JSON* format as is required to save or update them.  It's
a two-stage process:

- first you must ask OpenEHR to return the unique identifiers, known as *Composition Ids*, for all the
instances of a particular Template for a particular patient.

- secondly, for each of those *Composition Ids*, you can ask OpenEHR to return the entire contents of that
*Composition* (in our case representing a complete Allergy record), and furthermore, return it in
*Flat JSON* format.

The QEWD HIT Platform automates this process for you, providing you with a single REST API that will
fetch and return all the instances of a particular heading, for a specified patient, in 
*Unflattened Flat JSON* format.

Why in Unflattened format?  This will become clear when we move onto how JSON is transformed
in the QEWD HIT Platform.


So instead of using AQL to select a specific range of properties for a particular Template for a 
particular patient - the equivalent of this pseudo SQL:

        select t.a, t.b, t.c
        from {{p.templateId}} t
        where patientId p = {{patientId}}

 in effect we're doing the equivalent of this pseudo SQL:

        select *
        from {{p.templateId}}
        where patientId p = {{patientId}}

and, as a result, selecting the entire data for each instance of a heading.  The key thing is that
the structure of the JSON that is returned is pre-determined for each heading - its *Flat JSON* structure.

That same *Flat JSON* structure can be used to add new instances of that heading, or to modify an
existing instance.  

As a result, we have a single, symmetrical way of getting, setting and updating
OpenEHR data.


### Discovering the Flat JSON Structure for a Template

So how do you find out what the Flat JSON structure is for a particular Template?  Well, of course,
one approach would be to fetch and inspect the data for a patient.  But that only works if you already
have at least one instance of that Template saved against at least one patient.

In fact, OpenEHR provides an API that allows you to fetch a "canned" example of the *Flat JSON* for a
Template:

        GET /rest/v1/template/:templateId/example?format=FLAT&exampleFilter=INPUT

The QEWD HIT Platform's OpenEHR Interface MicroService provides a simple API that allows you
to access this, and the *demo* application provided with the QEWD HIT Platform shows how you
can use this to retrieve the example. However, the QEWD HIT Platform's API automatically
unflattens the *Flat JSON* example.  

We can then use this unflattened example for the specified OpenEHR Template as a reference 
template JSON record or schema for our subsequent processing of that heading, as will be
explained in the next section below.



## Transforming JSON

When writing applications that create, read or update OpenEHR records, it turns out that
a significant proportion of the work involves transforming one form of JSON into another.

We've seen in the previous section that OpenEHR can provide us with a specific JSON
structure that is pre-determined for each Template - in our case it's the unflattened
version of the Flat JSON for that Template.

That's a good start, but typically we need to interface an OpenEHR system:

- via a user interface, eg a Browser-based or mobile application, with which a user can 
retrieve and perhaps update a patient's clinical OpenEHR data

- with some other non-OpenEHR system, either another EHR or some other system or service.

### User Interface

In the case of a user interface (UI), the unflattened *Flat JSON* format used by OpenEHR is
unnecessarily verbose and unweildy for the purposes of a UI.  Typically you'll
want to present the user with a fairly simple form, probably asking for just a small subset
of the dataset represented in the Flat JSON schema.  

Similarly when displaying the heading data retrieved from OpenEHR, you'll typically want to
present as subset of the data in the UI, and in a much simpler structure than
retrieved in the *Flat JSON*-based record.

So we'll probably want to be able to transform the unflattened *Flat JSON* OpenEHR format
to and from a much simpler UI JSON format.

### External System Interfaces and FHIR

External systems are unlikely to know how to recognise handle OpenEHR's *Flat JSON* format.
Previously, each system would have likely had its own proprietary interface format, but these
days, more and more systems are standardising their interfacing around the 
[FHIR](https://www.hl7.org/fhir/) format.

Transforming data between OpenEHR *Flat JSON* format and the equivalent JSON structure 
for the appropriate FHIR Resource Type is therefore the key to making it possible to
interface and integrate OpenEHR system with other external systems.


### Transforming JSON Without Programming

A key goal of the QEWD HIT Platform has been to create a straightforward, scalable way of defining
and implementing these JSON transformations.  The goal has been to avoid requiring specific 
programming skills in a particular computer language.

Instead, the QEWD HIT Platform uses a declarative approach, whereby the transformation of JSON
from one format to another is defined in a template document that is, itself, a JSON document.

The aim is to facilitate the creation a set of definitive transformation template documents 
that can be developed and agreed collaboratively, and shared across the NHS (and potentially beyond),
therefore avoiding the otherwise all too common reinvention of the same 
old technical wheels.

The QEWD HIT Platform therefore makes use of a Node.js module known as 
[*qewd-transform-json*](https://github.com/robtweed/qewd-transform-json).  This provides
a JSON-based syntax for defining JSON transformations, and a set of associated methods that apply
these templates to perform the transformation.


### Pre-worked Examples

The QEWD HIT Platform includes pre-worked examples of such JSON Transformation documents for
the Allergies Template.  You'll find them in the 
[*/templates*](https://github.com/robtweed/qewd-hit-platform/tree/master/openehr-ms/templates/allergies)
 sub-folder of the *openehr-ms* MicroService folder

- **openehr-to-fhir.json**: Converts an Allergy unflattened *Flat JSON* record into 
FHIR AllergyIntolerance resource format

- **openehr-to-summaryheadings.json**: Converts an Allergy unflattened *Flat JSON* record into 
a simplified abbreviated sub-set of data for summary display in a UI

- **openehr-to-ui.json**: Converts an Allergy unflattened *Flat JSON* record into 
another simplified format, designed for use in a UI

- **ui-to-openehr.json**: Converts a simple JSON set of key/value pairs representing UI form
fields into an Allergy unflattened *Flat JSON* record


Further transformations for allergies and/or any other headings can be created by adding the
appropriate files to this */templates* folder.

Note: the heading name (*allergies* in our examples above) corresponds to the name used in the
*/configuration/openehr.json* file described earlier in this document.


### Creating JSON Transformation Template Documents

The JSON Transformation Template documents are simply text files, and as such you can create and
edit them using whatever editor or tool you wish.  They **must** be saved with a file extension
of *.json*.

You can optionally use a 
[browser-based tool for creating and editing the Transformation Template Documents](https://github.com/robtweed/qewd-transform-json-editor).






