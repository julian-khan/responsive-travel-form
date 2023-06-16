# Responsive Travel Form

Live website:
https://julian-khan.github.io/responsive-travel-form/

In this project, I created a responsive and accessible form for a travel company. The form collects information from the user about their travel intentions and preferences. This is a front-end project and therefore the collected data is not sent to a server for parsing.

A responsive design has been implemented by ensuring that the travel form is displayed appropriately on all viewports including mobile devices, tablets and desktop monitors. This responsiveness was achieved using CSS media queries that apply rules for particular-sized viewports. 

This travel form conforms to accessibility guidelines and is therefore highly accessible and simple to use for a diverse range of users. For example, HTML has been used purely for semantic markup to aid screen readers and other HTML parsers, with all styling done in CSS per best practice. Furthermore, CSS rules set the font sizes relative to the user's browser default settings to improve readability and the user experience.

JavaScript with regular expressions has been used to perform client-side input validation. The user's inputs are each checked and if there is an invalid input, the user is prevented from proceeding to the next section of the form and a specific error message is displayed. JavaScript has also been used to manipulate the DOM via the DOM API, to dynamically insert and remove these error messages. Progress bars on each section of the form are also dynamically updated.

If I were to redo or modify this project, I would decouple the dynamic HTML fragment sections created and inserted into the DOM for any partner, children and/or friends that the user travels with. Currently, there is a dependency between the code for creating and inserting these components and the section of the travel form that takes the user's information. To prevent this coupling, a 'person information' class could be created that acts as a factory to produce the relevant child and/or friend components. This factory would prevent the aforementioned coupling.

