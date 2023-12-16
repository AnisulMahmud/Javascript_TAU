# Welcome to your group's Web Development 1 group work repository

# WebDev1 group work assignment, rounds 8-11

What should be in this document is detailed in the 11th exercise round assignment document in Google Docs. "Group" and "Tests and documentation" are shown below as examples and to give a starting point for your documentation work.

# Group 

Member1:  Md Nasir Uddin Shuvo, nasir.shuvo@tuni.fi, 152134471, 
resposible for: 

Basically Nasir was responsible for working in backend and frontend with association with Anis.We divided task between us by breaking it down as modules and Nasir was mostly responsible for products and order module.
---------------------------------------------------

Member2:  Md Anisul Islam Mahmud, anisul.mahmud@tuni.fi, 152152220, 
resposible for: 

Basically Anis was responsible for working in backend and frontend with association with Nasir.We divided task between us by breaking it down as modules and Anis was mostly responsible for user module and fixing github issues and configuring  database.
---------------------------------------------------

Member3:  israt Runa, israt.runa@tuni.fi 
resposible for: 

Runa was mostly responsible for working with test cases and debugging the issues.She also worked on the backend of the project like testing apis in the postman and checking if every responses is accurate.

---------------------------------------------------


## Tests and documentation

All test cases are in  test/my.test.js

| Issues Number | GitLab issues |  Mocha tests  | Output |
|:--------------|:-------------:|--------------:|:------:|
|     1         |  Schema validation  :| must define "name" :|  test passed       |
|     2         |  User name Validation  | must require "name" to be at least one character long |  test passed       |
|     3         |  User role Validation  | must set default value of "role" to customer |  test passed       |
|     4         |  Validation of data  | should fail validation with invalid data |  test passed       |
|     5         |   Detection of password  | must detect correct "password" |  test passed       |
|     6         |  Detection of false password  | must detect a false "password" |  test passed       |
|     7         |  Header Checking  | should return false when "Content-Type" header is missing |  test passed       |
|     8         |  Checking header includings  | return false when "Accept" header does not include "application/json |  test passed       |
|     9         |  Checking response Status  | should set response status to 200 by default |  test passed       |
|     10         |  Server Error checking  | should set response status to 500 |  test passed       |


## Security concerns

Our application implements a robust security framework. CORS is controlled through middleware, permitting only authorized domains to access resources. Content Security Policy (CSP) headers are rigorously configured to limit script sources, thwarting Cross-Site Scripting (XSS). To counter Cross-Site Request Forgery (CSRF), anti-CSRF tokens are embedded in requests. Input validation is enforced, and secure coding practices are strictly adhered to, ensuring resilience against common web vulnerabilities. Regular security assessments and adherence to best practices fortify our API against evolving threats, providing a secure foundation for data transactions.





