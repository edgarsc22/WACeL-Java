# WACeL-Java
# Automated Analysis of Natural Language Requirements: Scenarios &amp; Lexicons Tool

C&L is a web application (Java, MySql) for editing, visualization and analysis of scenarios. C&L architecture is based on layers style, divided into modules and developed using Domain-driven Design practices. Modules group functionalities to manage users (User), projects (Project), lexicon symbols (Language used in the application - LEL), scenarios (Scenario) and to perform Analysis. The input of the C&L is composed of projects containing scenarios in plain text format. The output is a set of formatted scenarios, where the relationships among scenarios are represented by hyperlinks (It facilitates the navigation between scenarios). Other outputs include: (1) A Petri-Net representing the scenarios and their relationships and (2) a Feedback with detailed information about scenarios analysis.

Scenarios are often described using: 1) use case templates proposed by Cockburn [1] or Jacobson et al. [2]; 2) the scenario language proposed by Leite et al. [3]; or 3) their variations (e.g. [4]).

[1] A. Cockburn,Writing effective use cases, 1st ed.    Boston, MA, USA:Addison-Wesley Longman Publishing Co., Inc., 2000.

[2] I.   Jacobson,   M.   Christerson,   P.   Jonsson,   and   G.   Overgaard,Object-Oriented  Software  Engineering:  A  Use-Case  Driven  Approach.Addison-Wesley, 1992.

[3] J. C. S. do Prado Leite, G. D. Hadad, J. H. Doorn, and G. N. Ka-plan, “A scenario construction process,”Requirements EngineeringJournal, vol. 5, no. 1, pp. 38–61, 2000.

[4]	T.  Yue,  L.  C.  Briand,  and  Y.  Labiche,  “Facilitating  the  transitionfrom   use   case   models   to   analysis   models:   Approach   andexperiments,”ACM   Transactions   on   Software   Engineering   andMethodology (TOSEM),, vol. 22, pp. 1–38, 2013. [Online]. Available:http://doi.acm.org/10.1145/2430536.2430539

## C&L Architecture:
C&L enables the analysis of structural and behavioral properties of scenarios. To this purpose the C&L (Scenarios & Lexicons) prototype tool: 
- Parse textual scenarios into structured scenarios: Using Regular Expressions 
- Extract relevant information from scenarios (e.g. subject, action-verb, object, ...): [Using NLP POS Tagging and Dependency Parsing based strategies](https://github.com/edgarsc22/WACeL-Java/blob/master/doc/appendix/Appendix_B.pdf); 
- Discover sequential and non-sequential relationships among scenarios: Using information from scenarios and proximity index measure; 
- Derives Petri-Nets from structured scenarios: [Using Mapping Rules](https://github.com/edgarsc22/WACeL-Java/blob/master/doc/appendix/Appendix_C.pdf); 
- Discover certain types of defects in scenarios: [Using verification heuristics and searching for defect indicators](https://github.com/edgarsc22/WACeL-Java/blob/master/doc/appendix/Appendix_D.pdf); 
- [Advise general fix recommendations to repair defects](https://github.com/edgarsc22/WACeL-Java/blob/master/doc/appendix/Appendix_D.pdf). 

The C&L supports the most existing scenario and use case templates and enables a faster requirements analysis or serves as a complement to RE activities.

Figure below shows the high-level ﬂow of information through our approach (implemented in the C&L tool). 

  ##### C&L Architecture: Information Flow
<img src="https://github.com/edgarsc22/WACeL-Java/blob/master/doc/gui/information_flow.png" width="400">
    

C&L employs: 
- Natural Language Processing (NLP): POS tags and typed dependencies are used to pinpoint potential ambiguous and incomplete requirement statements.

- Petri-Net: Petri-Nets (translated from scenarios) analysis (reachability) can pinpoint potential inconsistencies due to concurrency issues at early development activities.

### Functionalities:

##### Scenario Visualization: 
After the user signing in, the system presents its main interface. In this interface there are many important elements to explore the system functionalities. These elements are: project menu, lexicon and scenarios menu and work area. The first element is located at the top right of the interface. It is through this menu that the user selects the project he wants to work with at the moment. 
    <img src="https://github.com/edgarsc22/WACeL-Java/blob/master/doc/gui/scenario_crud.png" width="700">
    
##### Scenario Analysis
The scenario analysis functionality is activated after the user selects a project or a scenario. This functionality generates a feedback containing a list of detected defects
    <img src="https://github.com/edgarsc22/WACeL-Java/blob/master/doc/gui/scenario_analysis.png" width="700">
    
##### Scenario to Petri Net
Once scenarios are constructed and pre-processed, it is possible to automatically generate Petri-Net formal models from structured scenarios. Figure below shows an integrated petri-net, i.e., petri-net was derived from a scenario and their related scenarios.
    <img src="https://github.com/edgarsc22/WACeL-Java/blob/master/doc/gui/scenario_petri_net.png" width="700">

### Tools:
- [Stanford Core NLP](https://stanfordnlp.github.io/CoreNLP/)
- [PIPE 2](http://pipe2.sourceforge.net/)
- [Joint JS](https://www.jointjs.com/)
 

##  Evaluation
  There are some real **projects** in the literature, and as a result, we selected 4 projects to evaluate the _accuracy_ of the heuristics implemented in the C&L tool: [Case Studies](https://github.com/edgarsc22/WACeL-Java/blob/master/doc/appendix/Appendix_E.pdf)

## Implementation Technologies used :

-   Spring Security 5.1.3.RELEASE
-   Spring 5.1.5.RELEASE
-   mysql-connector-java:jar 8.0.16
-   Maven 3
-   Java 8
-   Stanford Core NLP 3.9.2


Here are some helpful instructions to use the latest code:

### Build with Eclipse and Maven

1. Make sure you have MySql installed, details here:
    [https://www.mysql.com/downloads/](https://www.mysql.com/downloads/)
2. Create MySql schema "celdb" with user "root" and password "admin"     (change!)

3. Make sure you have Apache Tomcat installed, details here:
    [https://tomcat.apache.org/download-80.cgi](https://tomcat.apache.org/download-80.cgi)  --> Stop tomcat service
     
4. Make sure you have Eclipse IDE for Enterprise Java Developers, details here:     [https://www.eclipse.org/downloads/packages/](https://www.eclipse.org/downloads/packages/)
 
5. Eclipse IDE: Import as maven project (clone!)

6.  Eclipse IDE: Run as -> Maven build -> clean install

7. Eclipse IDE: Run as -> Run on server

8. Initialize (test user and profiles) "celdb": [initialize.sql](https://github.com/edgarsc22/WACeL-Java/blob/master/sqlscript/initialize.sql)

9. Initialize projects from Case Studies (projects and scenarios) in "celdb":  [case_study_projects.sql](https://github.com/edgarsc22/WACeL-Java/blob/master/sqlscript/case_study_projects.sql)

 10. go to http://localhost:8080/WACeL-Java and Test with user "test" and password "123456" (change!)
    
##  Reference
 
- E. Sarmiento, [Towards the improvement of natural language requirements descriptions: the C&L tool](https://dl.acm.org/doi/abs/10.1145/3341105.3374028), In The 35th ACM/SIGAPP Symposium On Applied Computing - SAC, 2020.

- E. Sarmiento, J. C. S. P. Leite, E. Almentero, [Analysis of Scenarios with Petri-Net Models](https://ieeexplore.ieee.org/abstract/document/7328013), In 29th Brazilian Symposium on Software Engineering (SBES), 2015.

- E. Sarmiento, J. C. S. P. Leite, and E. Almentero. [Using correctness, consistency, and completeness patterns for automated scenarios verification](https://ieeexplore.ieee.org/abstract/document/7407737/). 2015 IEEE Fifth International Workshop on Requirements Patterns (RePa). IEEE, 2015.

- E. Sarmiento, J. C. S. P. Leite, and E. Almentero. [C&L: Generating model based test cases from natural language requirements descriptions](https://ieeexplore.ieee.org/abstract/document/6908677/). IEEE 1st International Workshop on Requirements Engineering and Testing, 2014.

- E Sarmiento. [Analysis of Natural Language Scenarios](https://www.maxwell.vrac.puc-rio.br/28193/28193.PDF), Ph.D Thesis, Department  of Informatics, PUC-Rio, Brazil, 2016.