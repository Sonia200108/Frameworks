# Awesome School Project Van Siltn en Mathias

All our data can be tested through the webinterface on port 3000.

## GET REQUESTS:
/
```
This gets the index page
```


/children
```
This gets a list of all the children in the database. It displays their id, name, age and the id of the family that they are a part of (if they are in a family).
```
/children/add
```
This is the page where you can enter the information about the child you want to add. This then sends a post request to /children/submitFormChild
```
/children/:id
```
This gets one child from the database by id. It returns a 404 if the child is not found in the database.
```

/classes
```
This gets a list of all the classrooms in the database. It displays their id, name, the year of the class and the name of the teacher that is assigned to this class (if there is one assigned).
```
/class/add
```
This is the page where you can enter the information about the classroom you want to add. This then sends a post request to /class/submitFormClass
You can add 1 classroom or multiple in bulk.
```
/class/:id
```
This gets one classroom from the database by id. It returns a 404 if the classroom is not found in the database.
```

/teachers
```
This gets a list of all the teachers in the database. It displays their id, name, age and the classroom id the teacher is assigned to. A teacher is always assigned to a classroom.
This page also gives the option to delete this teacher. This is a non-cascade delete.
```
/teachers/add
```
This is the page where you can enter the information about the teacher you want to add. This then sends a post request to /teachers/submitFormClass
```

/parents
```
This gets a list of all the parents in the database. It displays their id, name, age and the id of the family the parent is assigned to (if the parent is assigned to a family).
```

/families
```
This gets a list of all the families in the database. It displays their id, name of the first parent, name of the second parent, a list of their children, the option to add a child to this family and the option to delete this family.
This delete option is a cascade delete, and deletes the children of the family.
```
/family/addchild/:familyId
```
This gets a list of all the current children in the family and gives a form where you can add a new child to this family.
This then sends a put request to /family/addchild/submitFormChildFamily
```

/family/add
```
This gives a form where you can select 2 parents to be part of a family. This throws an error when you want to create a family with the same parents.
This then sends a post request to /family/submitFormFamily
```

/admin
```
This is the landing page if you want to add elements to the database
```

## POST REQUESTS:
/children/submitFormChild  
/family/submitFormFamily  
/class/submitFormClass  
/teachers/submitFormTeacher
```
This are the endpoints where you send a post request to, with the body of the information about the item(s) you want to add in the database.
```

## PUT REQUESTS:
/family/addchild/submitFormChildFamily
```
This is the endpoint where the updated information of the child gets sent to.
```

## DELETE REQUESTS:
/family/delete/:id  
```
When a delete gets sent to this endpoint, the family gets deleted, this also deletes the children associated with the family.
```

/teacher/delete/:id
```
When a delete gets sent to this endpoint, the teacher gets deleted, this does not delete anything else.
```

• De datalaag bestaat uit minstens één DAO-object waaraan je objecten kan opvragen,
toevoegen, aanpassen



* MainDAO.Ts

• De datalaag bevat minstens één 1-1-relatie, 1-n-relatie en één n-n-relatie. Van deze relaties

* 1-1 = Teach-Classroom
* 1-n Child-Family
* n-n Child-Parent (Family als tussentabel)

is er minstens één met cascade en één zonder cascade.

* Delete family cascades the child
* delete Child doesn't cascade

• De datalaag bevat overerving.

* All classes inherit from Person

• Met de datalaag kan je één object toevoegen.

* Add Child, Add Parent

• Met de datalaag kan je een verzameling van objecten toevoegen.

* Add Classroom

• Met de datalaag kan je objecten opvragen. Voorzie zowel een “lazy” als niet “lazy”
opvraging.

* Get Children is lazy
* Get Parent and everything else isn't lazy

• De datalaag heeft ook een opvraging die gebruik maakt van parameters.

* get child by id, class by id, family by id

• Met de datalaag kan je objecten aanpassen.

* add child to family
