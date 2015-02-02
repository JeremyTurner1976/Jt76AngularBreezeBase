Based on Pluralsight Tutorials, alot of the angular/breeze architecture code is from John Papa's tutorial (#2 and 3)
http://www.pluralsight.com/courses/angularjs-fundamentals
http://www.pluralsight.com/courses/build-apps-angular-breeze
http://www.pluralsight.com/courses/build-apps-angular-breeze-part2


//Validations (note: breeze's built in validation is missing EF minlength and EF display name attributes) - see data-jt76-stringvalidate
//Angulars built in validation does require both server side and html page changes - but has the best user experience by far
http://www.ng-newsletter.com/posts/validations.html


//will have errors, logs, and users (db users can be edited and assigned roles (admin, access, action)), email objects for contact us
//will have admin page (admin role only, shows errors, logs, and users), (public)login/register (db saves), contact us and blank landing page will be the public menu content


todo - 
A search for "PRODUCTION:" will show items that can bring this product closer to that level
add users and auth (see https://github.com/robconery/ember-user-admin?files=1 authorization for an example)
users(holds roles (roles have types))


--to personalize the solution
rename all projects to the desired name
goto properties of each project and change assembly name and default namespace to desired name
ctrl-shift-f find/replace all Jt76Base with desired name
ctrl-shift-f find/replace all Jt76 with desired name
resharper - refactor - adjust namespaces in solution
Profit


--to create a new tabled view
recreate errors.js and errors.html as the new collection name
Find/Replace in both files (Match Case) "Errors" with "NewCollection", "errors" with "newCollection"
Setup the repository (start from repository.errors), and go from there
reset the view to show the data from the new tables (change bindings in newCollection.html)





