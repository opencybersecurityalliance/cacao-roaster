<img src="artwork/OASIS-Primary-Logo-Full-Colour.png" width="200">

# Governance

## Overview 

The work of the [Open Project name] community is governed by this document, in accordance with [OASIS Open Project Rules](https://www.oasis-open.org/policies-guidelines/open-projects-process/). The purpose of this document is to describe how the community works together to achieve its technical goals.

The [Open Project name] works as much as possible by lazy consensus, especially within each Technical Steering Committee (TSC), as described under [Decision Making](#decision-making) below.  Each TSC is responsible for determining when it has lazy consensus, guided by the principal that those who show up and do the work make the decisions.

The Project Governing Board (PGB) works by lazy consensus as much as possible, however, because of its role in project governance, there are specific steps that require a formal vote. These are described in the [Open Projects Process](link to pgb page). 

## Community Roles and Leadership

All members of the community must abide by all relevant OASIS policies including the [OASIS Open Projects Code of Conduct](./CODE-OF-CONDUCT.md). Failure to adhere to the Code of Conduct can have consequences including being held no longer eligible to participate in the work.

* *Contributors*: People who have contributed to a project repository are contributors. Anyone can be a contributor, so long as they sign the appropriate Contributor License Agreements [add appropriate link] and conform to the Open Project policies. 

* *Technical Steering Committee (TSC)*: Contributors can be invited by the PGB to join the TSC. A TSC generally covers the work on a single project within the Open Project. The TSC has day-to-day oversight of the technical work on the project and works with project maintainers to make sure project's goals are met. The TSC also advises the PGB on the technical agenda such as when works are ready for approval and release. The PGB must publish process documentation outlining the requirements for joining and voting in the project’s TSC.

   TSC members must have submitted an individual CLA, and if representing an organization, that organization must have signed and submitted an entity CLA as well.

   Each TSC has a chair or two co-chairs appointed by the PGB. The chair of a TSC is responsible for coordinating the committee's meetings, reviews, etc. The chair(s) should have a firm understanding of the technology under the TSC's purview, and the [skills of a Technical Project Manager](https://www.jobhero.com/technical-program-manager-job-description/).

* *Project Governing Board (PGB)*: The PGB oversees the overall strategy and direction of the project as well as the work of the TSCs. The PGB has final approval via Special Majority Vote of project releases and Project Specifications and their submission to the members of OASIS as candidates for OASIS Standard.  

   The PGB also follows and is responsible for upholding the [OASIS Open Projects Rules](url to op rules).

   The PGB is comprised of one representative from each Sponsoring organization, and a representative from each TSC (generally the chair). The PGB may create additional PGB member seats for expert representatives to be elected by the TSC or appointed by the PGB.

* *Maintainers*: Maintainers are recognized and trusted experts who serve to implement community goals and consensus design preferences. They demonstrate commitment to the success of the project and provide technical leadership that is broadly respected by the community. 

   At least one Maintainer must be identified by the PGB at the start of the project. In cooperation with the community and the initial Maintainers, the Technical Steering Committee may recommend additional Maintainer(s) to the PGB.

   For more information on the role of maintainer, see the [OASIS Open Projects Maintainers' Guidelines](https://github.com/oasis-open-projects/documentation/blob/master/guides/open-projects-maintainers-guide.md)

* *Editors*: Editors are appointed (or removed) by the relevant TSC. Any Contributor is eligible to be an Editor.

   Editors are expected to be actively involved in discussion of Proposals and helping them reach the quality level required to reach Candidate stage, and more generally to actively maintain the overall quality of their TSC's specifications.

   As defined in [Decision Making](#Decision-Making), Editors are empowered to interpret the "Lazy Consensus" of a TSC, subject to direction from the chairs to implement a formally declared decision.

## Starting and maintaining a Technical Steering Committee

### Initial requirements

To start a new TSC, there must be:

* a request from at least three sponsoring organizations who commit to participate, and 
* a named Chair and Co-Chair who have agreed to serve in the role

Ideally, a proposed TSC will have at least 5 initial participants.

### Maintenance requirements

To be considered _active_, a TSC must satisfy the following heartbeat requirements:

* at least 3 active participants representing at least 2 different companies, and
* at least 1 commit per month in one repo

Any TSC failing to meet one or more of the above heartbeat requirements is considered _inactive_.

A TSC considered inactive can resume activity at any time. The project assets produced by the TSC will remain publicly available to meet OASIS's archival persistence obligations. 

Note that the PGB may permit the formation or continuation of a TSC that does not meet the above requirements.

### Closing a TSC

The Project Governing Board may close a TSC at any time.

An active TSC may only be closed with a Special Majority Vote of the PGB.

Any TSC which is inactive may be closed with a Full Majority Vote.

A TSC which has been inactive for at least 6 consecutive months may be closed with a Simple Majority Vote.

Note that closing a TSC ends any conference calls and specification editing privileges but the project assets produced by the TSC will remain publicly available to meet OASIS's archival persistence obligations. 

## Decision Making

Everyday TSC decisions will be reached by [lazy consensus](https://communitymgt.fandom.com/wiki/Lazy_consensus). Editors are empowered to implement the consensus of a TSC as they see it. The TSC chair is empowered to direct the Editor(s) to make a change reflecting a decision of the TSC.

If the chairs of a TSC determine that consensus is not possible, then the TSC will not publish any output. 

Any TSC lazy consensus decision can be overturned by a 2/3 majority vote of the PGB at the request of a TSC member. However, the PGB is not required to take up the request.

The PGB is unlikely to overturn a decision based on a single objection from a contributor who has barely participated, or from an apparent "[branch-stacking](https://en.wikipedia.org/wiki/Branch_stacking)" (aka Room Packing) exercise. 

Lazy consensus does not apply to certain decisions of the PGB, as defined elsewhere in this document and in the Open Projects Process.

### Lazy Consensus

Out of respect for other contributors, major changes should be accompanied by a post on the email list as appropriate. Authors of proposals, Pull Requests, issues, etc. will give a time period of no less than seven (7) working days for feedback and comment, remaining cognizant of popular observed world holidays.

Maintainers may comment or request additional time for review, but should remain cognizant of blocking progress and abstain from delaying progress unless absolutely needed. The expectation is that blocking progress is accompanied by a guarantee to review and respond to the relevant action(s) (proposals, PRs, issues, etc.) in short order.

Lazy consensus does _not_ apply to some PGB decisions, including:

* Appointing or Removing TSC chairs or PGB Members
* Removing TSC Members
* Moving a release or a specification draft to the OASIS standards track process. 

## Proposal Process
Large changes, including new features, should be introduced by a written proposal. This allows members of the community to weigh in on the concept (including the technical details), share their comments, ideas, and use cases, and offer to help. It also ensures that members are not duplicating work or inadvertently stepping on each other's toes by making large conflicting changes.

The TSC's project roadmap is defined by accepted proposals. Each TSC accepts and develops proposals in a process patterned after the five development stages in the Ecma [TC39 process document](https://tc39.es/process-document/):

* Strawman (a description of an idea)
* Proposal (a formal request that it be considered for inclusion)
* Draft (a "specification-shaped" version of the proposal to be considered for implementation)
* Candidate (a "standard-ready" version for implementation testing before formal adoption)
* Finished (stable, in the formally published release version)

TSCs may tweak the process, and if they do so must record TSC-specific processes in a "Contributing.md" file in their project's main repository.

### Creating a new proposal
To make a feature request, document the problem and a sketch of the solution with others in the community and TSC.  One place to do this is in the respective OASIS TSC mailing list or Discourse.

Your goal will be to convince others that your suggestion is a useful addition and recruit TSC members to help turn your request into a Proposal and shepherd it to Finished.

### Proposal Lifecycle

Each TSC can create their own lifecycle. One approach is to mark each proposal with labels to represent the status of the proposal:

* **New**: Proposal is just created.
* **Reviewing**: Proposal is under review and discussion.
* **Accepted**: Proposal is reviewed and accepted (either by consensus or vote).
* **Rejected**: Proposal is reviewed and rejected (either by consensus or vote).

### Required conditions for acceptable complete specifications

Each TSC specification will only be considered complete when:

* It has appropriate documentation
* It has a test suite for all normative statements in the specification

## Contributor Obligations

Contributors to any TSC project must abide by the [OASIS Open Projects IPR Policy](https://github.com/oasis-open-projects/documentation/blob/master/policy/clas-and-special-covenant.md) and to the applicable open source license listed in the LICENSE.md file. 

All contributors are required to make these rights available by signing a [Contributor License Agreement (CLA)](<bot url>) and patent non-assertion covenant. If you have questions about these policies, please contact the [OASIS Project Administrator](project-admin@oasis-open.org). 

All participants must also abide by the terms of the [OASIS Open Projects Code of Conduct](https://github.com/oasis-open-projects/documentation/blob/master/CODE_OF_CONDUCT.md).

## Updating Governance

Substantive changes to this document may be made by a Special Majority Vote of the PGB. Proposed changes should be made as Pull Requests on this document. Votes should be cast as reviews - approve or request changes. 

If a PR is 7 days old, and there are sufficient reviews that the next vote meets the requirements for approving a change, that voter can merge the PR.









