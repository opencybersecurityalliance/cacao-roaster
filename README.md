<img src="artwork/OCA 1.png" width="400">

# CACAO Roaster Sub-Project

CACAO Roaster is a sub-project of the Open Cybersecurity Alliance. It is a web application for generating, parsing and validating, manipulating, and visualizing CACAO v2.0 playbooks.

# Table of contents

- [CACAO Roaster Sub-Project](#cacao-roaster-sub-project)
- [Table of contents](#table-of-contents)
- [Project Logo](#project-logo)
- [Introduction](#introduction)
  - [Project status](#project-status)
  - [Integration with other existing OCA or OASIS projects](#integration-with-other-existing-oca-or-oasis-projects)
  - [Screenshots of the application](#screenshots-of-the-application)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [Maintainers](#maintainers)
  - [Support](#support)
    - [Sign up for our mailing list](#sign-up-for-our-mailing-list)
    - [Join us on Slack](#join-us-on-slack)
  - [License](#license)
- [Governance](#governance)
- [CLA \& Non-assert signatures required](#cla--non-assert-signatures-required)
# Project Logo

<img src="/artwork/CACAO-Roaster-logo.png" alt="CACAO Roaster logo" width="400"/>

# Introduction

As cyber systems become increasingly complex and cybersecurity threats become more prominent, defenders must prepare, coordinate, automate, document, and share their response methodologies to the extent possible. The CACAO standard was developed to satisfy the above requirements providing a common machine-readable framework and schema to document cybersecurity operations processes, including defensive tradecraft and tactics, techniques, and procedures.

For wider adoption of the CACAO standard, it is crucial to support and simplify the playbook creation, modification, and understanding. **CACAO Roaster supports the aforementioned by providing a faster and easier way to create, manipulate, visualize and share CACAO playbooks in a “no-code” graphical manner.**

The CACAO Roaster web application complies fully to the [CACAO v2 CS01](https://docs.oasis-open.org/cacao/security-playbooks/v2.0/security-playbooks-v2.0.pdf) specification.

## Project status

The CACAO Roaster is now in a stable version 1.0.0 and is under continuous maintenance and further development.
The development team has an overview of open issues/working items, and we will shortly share them on the GitHub issues page.

## Integration with other existing OCA or OASIS projects

CACAO, STIX, OpenC2

## Screenshots of the application

Start screen of the application.
![Start screen of the application](/artwork/CACAO-Roaster-1.png)

Creating a new playbook.
![Start screen of creating new playbook](/artwork/CACAO-Roaster-2.png)


# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes. See deployment for notes on how to deploy the project on a live system.

Prerequisites:

* node >= 20.5.0
* npm >= 9.8.0

## Installation

```
npm i
```

**Run the project locally (in development mode)**

```
npm run start
```

**Building the project for production**

```
npm run build
```

## Deployment

Install serve service on hosting machine

```
npm install serve
```

Host production bundle

```
serve dist
```

Or use [Docker](https://www.docker.com/) to spin up a fully functioning container

```
docker build -t cacao-roaster .
docker run -it -p 3000:3000 cacao-roaster
```

## Contributing

Add a brief explanation of what kind of contributions you are looking for and what your requirements are for accepting them. Add a link to [CONTRIBUTING.md](/CONTRIBUTING.md) and a link to [CODE_OF_CONDUCT](link to your code_of_conduct.md file).

## Maintainers

* Mateusz Zych: [https://github.com/mateusdz](https://github.com/mateusdz)
* Vasileios Mavroeidis: [https://github.com/Vasileios-Mavroeidis](https://github.com/Vasileios-Mavroeidis)

## Support

Where can people ask for help: this can be any combination of an issue tracker, Slack, a chat room, an email address, etc.

### Sign up for our mailing list

Stay up to date on meetings, announcements and other discussions with the [CACAO Roaster mailing list](https://lists.oasis-open-projects.org/g/oca-cacao-roaster). To subscribe, send an empty email to [oca-cacao-roaster+subscribe@lists.oasis-open-projects.org](mailto:oca-cacao-roaster+subscribe@lists.oasis-open-projects.org).

### Join us on Slack

CACAO Roaste has a Slack channel on the OCA slack. [Join here](https://join.slack.com/t/open-cybersecurity/shared_invite/zt-1jsgt1053-oYsfBPXXChhbRO4JO5Xo1A) and say hi in #cacao-roaster.

## License

*Example text*: This project is licensed under the  Aapache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details

# Governance

[Open Project name] operates under the terms of the [Open Project Rules](https://www.oasis-open.org/policies-guidelines/open-projects-process) and the applicable license(s) specified in [LICENSE.md](LICENSE.md). Further details can be found in [GOVERNANCE.md](GOVERNANCE.md).

# CLA & Non-assert signatures required

All technical contributions must be covered by a Contributor's License Agreement. This requirement allows our work to advance through OASIS standards development stages and potentially be submitted to de jure organizations such as ISO. You will get a prompt to sign this document when you submit your first pull request to a project repository, or you can sign [here](https://www.oasis-open.org/open-projects/cla/oasis-open-projects-individual-contributor-license-agreement-i-cla/). If you are contributing on behalf of your employer, you must also sign the ECLA [here](https://www.oasis-open.org/open-projects/cla/entity-cla-20210630/).
