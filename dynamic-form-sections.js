/* The below function adds an event listener to each form section. The event listener
responds to changes in the form section's child input elements of type checkbox */
function addCheckboxListener(containerElement) {
    containerElement.addEventListener('change', (e) => {
        /* Do not action the rest of the statements in this event listener if
        the event target is not of type checkbox. This check is necessary because
        event delegation is being used and thus other inputs that are changed should
        not trigger this event listener.*/
        if (e.target.type != "checkbox") {
            return
        }
        const IsChecked = e.target.checked;

        /*Check the name of the event target and use a callback function to 
        dynamically create the required additional fields based on the user's input. */
        if (e.target.name.includes('with-friends')) {
            toggleInputComponent(IsChecked, e.target, createNumberOfFriendsInput);
        } else if (e.target.name.includes('dietary-requirements')) { 
            toggleInputComponent(IsChecked, e.target, createDietRequirementsInput);
        } else if (e.target.name.includes('inclusive-needs')) {
            toggleInputComponent(IsChecked, e.target, createTextAreaField);
        } else if (e.target.name.includes('diet-other')) {
            toggleInputComponent(IsChecked, e.target, createTextAreaField);
        } else if (e.target.name.includes('travel-mode-other')) {
            toggleInputComponent(IsChecked, e.target, createTextAreaField);
        }
    return
})
}

function toggleInputComponent(IsChecked, toggledCheckbox, creatorFunc) {
    /* This function is used to create, hide and show dynamically created HTML elements that are inserted into 
    the document tree. The function is passed an argument to creatorFunc, which is a callback function that 
    creates the required components for the given user input
    */
    
    if (IsChecked) { //If the target checkbox is checked, run the code contained in this if block.
            if (toggledCheckbox.nextElementSibling) { //if the dynamic input to be created already exists, set it to visible and return from function call.
                toggledCheckbox.nextElementSibling.classList.remove('invisible');
                return;
            }
            // If the required dynamic input does not exist, create it using the callback function.
            creatorFunc(toggledCheckbox);
        }
    else { //Hide rather than delete the DOM element to prevent it having to be recreated.
        toggledCheckbox.nextElementSibling.classList.add('invisible');
    }
    return
}

/* The below function dynamically creates an input that enables the user to specify the number of friends 
that they are travelling with. */
function createNumberOfFriendsInput(currentElement) {
    let friendCountInput = document.createElement('div');
    friendCountInput.classList.add('dynamic', 'num-friends')
    friendCountInput.id = 'num-friends-container';

    friendCountInput.innerHTML = '<label for="num-friends">The number of friends that you are traveling with </label>'
    friendCountInput.innerHTML += '<input type="number" id="num-friends" class="dynamic" name="num-children" min="1" max="10" step="1" value="1" >';

    // Dynamically insert the created element into the document tree.
    currentElement.after(friendCountInput);
}

/*The below function dynamically creates a dietary requirements input if the user indicates that they have a
dietary requirement.*/
function createDietRequirementsInput(currentElement) {
    let dietReqInput = document.createElement('fieldset');
    //The dynamic class will be used to remove dynamic fields when the template is copied for partner, child and friend components.
    dietReqInput.classList.add('dynamic', currentElement.name, 'checkbox-list'); 
    
    dietReqInput.innerHTML = '<p>Please indicate your specific dietary requirements:</p>'

    const dietReqOptions = ['vegetarian', 'vegan', 'kosher', 'halal', 'allergies', 'diet-other'];

    const existingDietReqFields = document.querySelectorAll('.diet-req-container').length;
    dietReqInput.id = 'diet-req-container-' + existingDietReqFields;

    for (let i = 0; i < dietReqOptions.length; i++) {

        let newDiv = document.createElement('div');
        newDiv.classList.add('checkbox-container', 'two-col')

        // Capitalise the label text.
        let labelText = dietReqOptions[i][0].toUpperCase() + dietReqOptions[i].slice(1);

        if (labelText === "Diet-other") {
            labelText = "Other";
        }

        labelText.charAt(0).toUpperCase;
        // Assign unique values to the for attribute of created label elements and corresponding id attributes to the created inputs.
        newDiv.innerHTML += `<label for="${dietReqOptions[i]}-${existingDietReqFields}">${labelText}</label>`;
        newDiv.innerHTML += `<input type="checkbox" id="${dietReqOptions[i]}-${existingDietReqFields}" name="${dietReqOptions[i]}">`; 
        dietReqInput.appendChild(newDiv);
    }
    currentElement.after(dietReqInput);
}

// Dynamically create textarea elements when required.
function createTextAreaField(currentElement, labelText='Please specify') {
    let newFieldContainer = document.createElement('div');
    newFieldContainer.classList.add('dynamic', currentElement.name);

    const informationType = currentElement.name;

    const numExistingFields = document.querySelectorAll(`.dynamic.${informationType}`).length;

    newFieldContainer.innerHTML += `<label for="${informationType}-${numExistingFields}">${labelText}<span>*</span></label>`;
    newFieldContainer.innerHTML += `<textarea id="${informationType}-${numExistingFields}" name="${informationType}-${numExistingFields}" required>`;
    currentElement.after(newFieldContainer);
}

function createPartnerOrFriendComponent(partner=false, friendCount=1) {
    /* The HTML template for the user's partner and friend(s) if applicable will be dynamically created by this function,
    using a pre-existing template.
    
    insertCount: int - the number of partner and friend pages inserted*/

    const template = document.querySelector('.partner-and-friends-template');
    let clone = template.content.firstElementChild.cloneNode(true);

    const sourceFormComponentsClone = document.querySelector('.personal-info-template').cloneNode(true);
   
    if (partner) {
        cloneFormatter(sourceFormComponentsClone, 'partner');
        clone.classList.add('partner-component');
        clone.querySelector('h2').textContent = 'About your partner';

        //Adjust wording of particular fields to suit a partner
        sourceFormComponentsClone.querySelector('label[for*=dietary-requirements]').innerText = 'Does your partner have any dietary requirements?';
        sourceFormComponentsClone.querySelector('label[for*=inclusive-needs]').innerText = 'Does your partner have any needs related to physical mobility or other?';

    } else { // else block executes if partner is false and thus a friend component is to be created.
        cloneFormatter(sourceFormComponentsClone, 'friend');
        clone.classList.add('friend-component');
        clone.querySelector('h2').textContent = `About friend ${friendCount}`;

        //Adjust wording of particular fields to suit a friend
        sourceFormComponentsClone.querySelector('label[for*=dietary-requirements]').innerText = 'Does your friend have any dietary requirements?';
        sourceFormComponentsClone.querySelector('label[for*=inclusive-needs]').innerText = 'Does your friend have any needs related to physical mobility or other?'
    }
    clone.appendChild(sourceFormComponentsClone);
    return clone;
}

/* This function creates a child component using a pre-existing template. Like the partner and
friend components, the child component is only created if the user indicates on the first section
of the form that they are travelling with children.*/
function createChildComponent(insertCount, childCount=1) {
    const template = document.querySelector('.partner-and-friends-template');
    let clone = template.content.firstElementChild.cloneNode(true);
    clone.classList.add(`section-${insertCount}`);
    clone.classList.add('child-component');
    clone.querySelector('h2').textContent = `About child ${childCount}`;

    const sourceFormComponentsClone = document.querySelector('.personal-info-template').cloneNode(true);
    cloneFormatter(sourceFormComponentsClone, 'child');

    //Remove fields irrelevant to a child
    const componentsToDelete = sourceFormComponentsClone.querySelectorAll('.email-wrapper, .contact-wrapper, .gender-wrapper, .occupation-wrapper');
    for (let i=0; i < componentsToDelete.length; i++) {
        componentsToDelete[i].remove() 
    }

    //Adjust wording of particular fields to suit a child
    sourceFormComponentsClone.querySelector('label[for*=dietary-requirements]').textContent = 'Does your child have any dietary requirements?';
    sourceFormComponentsClone.querySelector('label[for*=inclusive-needs]').textContent = 'Does your child have any needs related to physical mobility or other?';

    clone.appendChild(sourceFormComponentsClone);
    return clone;
}

/* This function formats cloned elements to ensure that they are ready to be dynamically inserted into the document tree. 
Actions performed include removing any dynamically created fields that existed in the template and unchecking all checkboxes. */
function cloneFormatter(cloneElement, PartnerChildOrFriend) {

    cloneElement.classList.remove('personal-info-template');

    const allInputsExceptRadio = cloneElement.querySelectorAll('input:not([type=radio])'); 
    for (let i = 0; i < allInputsExceptRadio.length; i++) {
        //Clear input values in the copied clone that were copied from the template
        allInputsExceptRadio[i].value = '';
    }

    const dynamicFields = cloneElement.querySelectorAll('.dynamic');
    for (let i = 0; i < dynamicFields.length; i++) {
        dynamicFields[i].remove();
    }

    const invalidFields = cloneElement.querySelectorAll('.invalid');
    for (let i = 0; i < invalidFields.length; i++) {
        invalidFields[i].classList.remove('invalid');
    }

    const checkedBoxes = cloneElement.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < checkedBoxes.length; i++) {
        if (checkedBoxes[i].checked) {
            checkedBoxes[i].checked = false;
        }
    }
    // The below function ensures that created components have unique id and name values.
    setUniqueIdsAndNames(cloneElement, PartnerChildOrFriend);
}

/*This function ensures that all cloned partner, child and friend components have unique id and name attributes. 
Ensuring that these attributes have unique values is necessary to avoid collisions in which elements that are
already in the document tree have their values overridden by these newly cloned elements.*/
function setUniqueIdsAndNames(cloneElement, PartnerChildOrFriend) {

    let uniqueDesignatorStr;

    if (PartnerChildOrFriend === 'partner') {
        uniqueDesignatorStr = 'partner';
    } else if (PartnerChildOrFriend === 'child') {
        const existingChildrenCount = document.querySelectorAll('.child-component').length;
        uniqueDesignatorStr = `child-${existingChildrenCount+1}`;
    } else if (PartnerChildOrFriend === 'friend') {
        const existingFriendCount = document.querySelectorAll('.friend-component').length;
        uniqueDesignatorStr = `friend-${existingFriendCount+1}`;
    }

    const allInputsAndLabels = cloneElement.querySelectorAll('input, label');

    for (let i = 0; i < allInputsAndLabels.length; i++ ) {
        if (allInputsAndLabels[i].htmlFor) {
            allInputsAndLabels[i].htmlFor = `${uniqueDesignatorStr}-${allInputsAndLabels[i].htmlFor}`;
        }
        if (allInputsAndLabels[i].id) {
            allInputsAndLabels[i].id = `${uniqueDesignatorStr}-${allInputsAndLabels[i].id}`;
        }

        if (allInputsAndLabels[i].name) {
            allInputsAndLabels[i].name = `${uniqueDesignatorStr}-${allInputsAndLabels[i].name}`;
        }
    }
}

function managePartnerChildFriendComponents() {
    //Manage partner components
    const hasPartner = document.querySelector('#with-partner').checked;
    if (hasPartner && !document.querySelector('.partner-component')) {
        const newPartnerComponent = createPartnerOrFriendComponent(true);
        document.querySelector('.partner-child-friends-button-container').before(newPartnerComponent);
    }

    if (!hasPartner && document.querySelector('.partner-component')) { //delete the partner component if partner checkbox is unchecked later by user
        document.querySelector('.partner-component').remove() 
    }

    //Manage child components
    let childCount = document.querySelector('#num-children').value;
    let existingChildComponentCount = document.querySelectorAll('.child-component').length;

    while (existingChildComponentCount != childCount) {
        if (existingChildComponentCount < childCount) {
            const newChildComponent = createChildComponent(0, existingChildComponentCount + 1); //+1 so the UI does not display 0-indexing
            document.querySelector('.partner-child-friends-button-container').before(newChildComponent);
            existingChildComponentCount += 1;
        }
        else { //This else section will run when the number of existing child components is greater than required
            let allChildComponents = document.querySelectorAll('.child-component');
            allChildComponents.item(allChildComponents.length-1).remove();
            existingChildComponentCount -= 1;
        }
    }

    //Manage friend components
    const hasFriends = document.querySelector('#with-friends').checked;
    
    if (hasFriends) {
        const friendComponentsNeeded = document.querySelector('#num-friends').value;
        let existingFriendComponentCount = document.querySelectorAll('.friend-component').length;

        while (existingFriendComponentCount != friendComponentsNeeded) {
            if (existingFriendComponentCount < friendComponentsNeeded) {
                const newFriendComponent = createPartnerOrFriendComponent(false, existingFriendComponentCount + 1);
                document.querySelector('.partner-child-friends-button-container').before(newFriendComponent);
                existingFriendComponentCount += 1;
            }
            else { //This else section will run when the number of existing child components is greater than required
                let allFriendComponents = document.querySelectorAll('.friend-component');
                allFriendComponents.item(allFriendComponents.length-1).remove();
                existingFriendComponentCount -= 1;
            }
        }
    }
    //delete all existing friend components if friend checkbox is unchecked later by user
    else if (!hasFriends && document.querySelector('.friend-component')) { 
        const friendComponents = document.querySelectorAll('.friend-component');
        
        for (let i = 0; i < friendComponents.length; i++) {
            friendComponents[i].remove();
        }
    }
}
   
//Functions to set interactivity of the country list
function setCountryListVisibility() {
    const sectionsToHide = document.querySelectorAll('.interactive-select-list > li > ul');
    for (let i = 0; i < sectionsToHide.length; i++) {
        sectionsToHide[i].classList.add('invisible');
    }

    const leafItemsToHide = document.querySelectorAll('.interactive-select-list .select-leaf-list');
    for (let i = 0; i < leafItemsToHide.length; i++) {
        leafItemsToHide[i].classList.add('invisible');
    }
}

function setCountryHeadingClickListener() { //Event delegation to the container of the interactive select list
   const countryList = document.querySelector('.interactive-select-list');
   countryList.addEventListener('click', (e) => {

    if (e.target.nodeName != "H3" &&  e.target.nodeName != "H4") {
        return
    }
    e.target.nextElementSibling.classList.toggle('invisible');
   })
}

function setCountryListeners() {
    const countryList = document.querySelector('.interactive-select-list');

    countryList.addEventListener('click', (e) => {
        if (e.target.children.length > 0 || e.target.nodeName != "LI") {
            return
        }
        e.target.classList.toggle('selected-item');
    })

    countryList.addEventListener('hover', (e) => {
        if (e.target.children.length > 0 || e.target.nodeName != "LI") {
            return
        }
        e.target.classList.toggle('selection-mouseover');
    })
}

// This function collates the user's country selections and adds them to the hidden input's value.
function collectCountrySelections() {
    const targetInput = document.querySelector('#country-selections-input');
    let serialisedCountryList = '';

    const selectedCountries = document.querySelectorAll('.selected-item');

    for (let i = 0; i < selectedCountries.length; i++) {
        serialisedCountryList += selectedCountries[i].textContent + ';'  // ; is the delimiter used in this serialisation
    }
    targetInput.value = serialisedCountryList;
}


const nextButtonEventHandler = (e) => {
    /*The below conditional prevents the below code from being executed when click events occur on non-button elements. 
    This is needed because the parent form section is handling click events for its child buttons (event delegation). */
    if (!(e.target.nodeName === "BUTTON" && e.target.className.includes('next'))) { 
        return
    }

    const targetContainer = e.target.closest('.form-section');
    const requiredInputs = targetContainer.querySelectorAll('input[required], textarea[required], input.required');

    if (requiredInputs.length > 0) {
        manageInvalidInputErrorDisplays(requiredInputs);
    }
    
    //Check if any required visible inputs have errors and prevent the next section of the form being revealed if errors exist    
    const inputsWithErrors = targetContainer.querySelectorAll('.invalid:not(.invisible *)');
    if (inputsWithErrors.length > 0) {
        return;
    }

    let currentFormSectionIndex;
    //Find the next section of the form and display it
    const allFormSections = document.querySelectorAll('.form-section');
    let seenCurrentSection = false;

    for (let i = 0; i < allFormSections.length; i++) {
        if (allFormSections[i] === targetContainer) { //Current form section found
            allFormSections[i].classList.add('invisible');
            seenCurrentSection = true;
            continue;
        }
        if (seenCurrentSection && 
            allFormSections[i].querySelector('progress'))
         {  
            /* This if block ensures that empty form containers are not made visible (eg when the user selects 
                that they are not traveling with a partner, child or friend). */
            if (allFormSections[i].id === 'inserted-partner-child-friends') {
                if(!allFormSections[i].querySelector('section')) {
                    continue;
                }
            }
            
            allFormSections[i].classList.remove('invisible');
            currentFormSectionIndex = i;
            break;
        } 
    }

    //Update progress bar element in all form sections
    const formProgressAsDecimal = (currentFormSectionIndex + 1) / allFormSections.length  // +1 due to 0-indexing
    setFormProgressValues(formProgressAsDecimal);
    setFormSectionNumbers();
};

//This function manages the reporting of invalid inputs for required form fields to the user.
function manageInvalidInputErrorDisplays(requiredInputs) {
    
    let errorPresent = false;

    for (let i = 0; i < requiredInputs.length; i++) {
        const errorMessage = requiredInputs[i].parentNode.querySelector('.error-message'); //containing div  

        if (!(isValidField(requiredInputs[i]))) {
            errorPresent = true;
            requiredInputs[i].classList.add('invalid');

            //check if error message has already been created
            if (errorMessage) { 
                errorMessage.classList.remove('invisible')
                
            // If the error message does not exist, create it
            } else {
                let errorPara = document.createElement('p');
                errorPara.textContent = createErrorMessageStr(requiredInputs[i]);
                errorPara.classList.add('dynamic', 'error-message');
                requiredInputs[i].parentNode.appendChild(errorPara);
            }

        }
        else {
            requiredInputs[i].classList.remove('invalid');
            errorMessage ? errorMessage.classList.add('invisible') : null;
        }
    }

    // Select the user's input start and end dates, if they exist in the current form section.
    const startAndEndDates = requiredInputs[0].closest('.form-section').querySelectorAll('input[name*=start-date], input[name*=end-date]');

    // If the user has input start and end dates, call manageStartEndDateError to check that they dates are valid.
    if (startAndEndDates.length === 2 && startAndEndDates[0].value && startAndEndDates[1].value) {
        manageStartEndDateError(startAndEndDates[0], startAndEndDates[1]);
    }
    
    // Display a global error message on the form if there are errors present.
    const formSectionElement = requiredInputs[0].closest('.form-section');
    errorPresent? manageGlobalErrorMessage(formSectionElement, true) : manageGlobalErrorMessage(formSectionElement, false);
}

/* This function manages the creation and display of a global error message, to indicate to the user that there is an error in one
or more required form fields. */
function manageGlobalErrorMessage(formSectionElement, isError) {
    const sectionGlobalErrorElement = formSectionElement.querySelector('.section-global-error');

    if (isError) {
        if (sectionGlobalErrorElement) {
            sectionGlobalErrorElement.classList.remove('invisible');
        }
        else {
            let errorPara = document.createElement('p');
            errorPara.textContent = 'There is an error in the input for one or more fields. Please check your entries.';
            errorPara.classList.add('dynamic', 'error-message', 'section-global-error');

            const insertLocation = formSectionElement.querySelector('.button-container');
            insertLocation.before(errorPara);
        }   
    } else {
        sectionGlobalErrorElement ? sectionGlobalErrorElement.classList.add('invisible') : null;
    }
}

/* This function creates a specific error message for specific input elements that have failed
input validation. */
function createErrorMessageStr(inputElement) {
    const type = inputElement.type;
    const name = inputElement.name;

    if(name.includes('name')) {
        return 'A name field must be at least two characters in length and only consist of alphabetical characters.'
    } else if (name.includes('date') && !name.includes('birth')) {
        return 'A date must be selected that is after the current date.'
    } else if (name.includes('date')) {
        return 'A valid date must be selected.'
    } else if (name.includes('email')) {
        return 'An invalid email address was entered. Please enter a valid email address.'
    } else if (name.includes('contact-number')) {
        return 'Please enter a valid Australian mobile or landline number.'
    } else if (type === 'radio') {
        return 'Please select one option.'
    } else if (type === 'textarea') {
        return 'A message of at least two characters in length is required for this section.'
    } else if (name === 'country-selections') {
        return 'Please select at least one country.'
    }
}

/*This function determines whether or not a given input element has a valid value, using callback function
selected based on the particular type of input. */
function isValidField(inputElement) {
    if (!inputElement.validity.valid) {
        return false;
    }

    if (inputElement.type === 'radio') {
        return isRadioInputSelected(inputElement);
    }

    if (inputElement.type === 'email') {
        return isValidEmail(inputElement.value);
    } else if (inputElement.type === 'text' && 
    (inputElement.name.includes('first-name') || 
    inputElement.name.includes('last-name'  ))) { 
            return isValidName(inputElement.value);
    } else if (inputElement.type === 'tel') {
        return isValidTel(inputElement.value);
    } //Check if the date is after the current date, which should be the case for event dates other than the user's birthday
    else if (inputElement.type === 'date' && !inputElement.name.includes('birth-date')) { 
        return inputElement.validity.valid && isValidDate(inputElement.value)
    } // The element.validity.valid property is true if the date is valid and false if it is not valid 
    else if (inputElement.type === 'date') { 
        return inputElement.validity.valid;
    } else if (inputElement.type === 'textarea') {
        return isValidTextArea(inputElement.value);
    }

    //Check that at least one country has been selected in the interactive country list
    if (inputElement.id === "country-selections-input") {
        return isCountrySelected(inputElement);
    }
}


//The below function checks if, for a collection of radio inputs with a given name, one radio input is selected.
function isRadioInputSelected(radioElement) {
    const inputName = radioElement.name;
    const sameRadioList = radioElement.closest('.radio-container').querySelectorAll(`input[type=radio][name=${inputName}]`);
    for (let i = 0; i < sameRadioList.length; i++) {
        if (sameRadioList[i].checked) {
            return true;
        }
    }
    return false;
}

/* The below functions validate various types of input elements using JavaScript regular expressions. The validation is not overly strict, 
to prevent validation from failing unecessarily. */
function isValidEmail(emailStr) {
    // The below regex expression was adapted from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript.
    const regex = /^[^@\s]+@[^@\s]+.[^@\s]+$/;
    return regex.test(emailStr);
}

function isValidName(nameStr) {
    //Below regex expression adapted from https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
    //The name must be at least two characters in length and allows for the "-',." characters
    const regex = /^[-',\. a-z]{2,}$/i;
    return regex.test(nameStr);
}

function isValidTel(telStr) {
    const regex = /^((04\d{8})|(9\d{7}))$/; 
    return regex.test(telStr);
}

function isValidTextArea(textAreaStr) {
    /*The below regex expression will match two or more alphanumeric characters. This flexible matching is appropriate
for an input of type text area because these fields can contain varying types of text that may include letters or numbers 
with varying character length*/
    const regex = /[\w]{2,}/;
    return regex.test(textAreaStr);
}

// The below function checks that the argument passed to the function is a date that is after the present date.
function isValidDate(dateStr) {
    const eventDate = new Date(dateStr);
    const currentDate = new Date();
    return eventDate > currentDate;
}

// The below function manages the reporting of error messages for date inputs.
function manageStartEndDateError(dateElement1, dateElement2) {

    const errorMessage = dateElement1.parentNode.querySelector('.date-start-end-error');

    if (!isValidDatePair(dateElement1.value, dateElement2.value)) {
        dateElement1.classList.add('invalid');
        if (!errorMessage) { //If the dates are not a valid pair and an error message has not been created, create one.
            let errorPara = document.createElement('p');
            errorPara.textContent = 'The start date must be on or before the end date.';
            errorPara.classList.add('dynamic', 'error-message', 'date-start-end-error');
            dateElement1.parentNode.appendChild(errorPara);
        }
        //If the error message container has already been created
        else {
            errorMessage.classList.remove('invisible')
        } 
    }
    else {
        isValidDate(dateElement1)? dateElement1.classList.remove('invalid') : null;
        errorMessage ? errorMessage.classList.add('invisible') : null;
    }
}

// Check that the second date string argument is at a later date than the first date string argument.
function isValidDatePair(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    return date2 >= date1;
}

// Checks that at least one country has been selected.
function isCountrySelected(inputElement) {
    return inputElement.value? true : false;
}

/* This event handler ensures that when a previous button is clicked, the current section is hidden and the previous
one is displayed */
function prevButtonClickHandler(e) {
    const formSection = e.target.closest('.form-section');
    formSection.classList.add('invisible');

    const allFormSections = document.querySelectorAll('.form-section');

    let i = allFormSections.length;
    let seenCurrentSection = false;
    while (i >= 0) {
        if (allFormSections[i] === formSection) {
            seenCurrentSection = true;
            i--;
            continue;
        } 
        
        if (seenCurrentSection) {
            if (allFormSections[i].id === 'inserted-partner-child-friends') {
                if (!allFormSections[i].querySelector('section')) { //checking if no partner, child or friend sections have been dynamically added.
                    i--;
                    continue;
                }
            }
            allFormSections[i].classList.remove('invisible');
            break;
        }
        i--;
    }

}

// Dynamically update the form progress bar based on the user's progress through the form.
function setFormProgressValues(formProgressAsDecimal) {
    const allProgressElements = document.querySelectorAll('.form-section progress');
    const MAX_PROGRESS = allProgressElements[0].max;
    const CURRENT_PROGRESS = allProgressElements[0].value;
    
    const currentSectionProgress = formProgressAsDecimal * MAX_PROGRESS;

    const newCurrentProgress = Math.max(CURRENT_PROGRESS, currentSectionProgress);
    

    for (let i = 0; i < allProgressElements.length; i++) {
        allProgressElements[i].value =  newCurrentProgress;
    }
}

// Dynamically number the sections of the form.
function setFormSectionNumbers() {
    const allFormSections = document.querySelectorAll('.form-section');
    let sectionCount = allFormSections.length;

    const parentChildFriendCheckboxes = document.querySelectorAll('#with-partner, #num-children, #with-friends')

    /* If partner, child or friend components have not been created, do not include the form section that contains them 
    in the section numbering */
    let isPartnerChildFriend = false;
    for (let i = 0; i < parentChildFriendCheckboxes.length; i++) {

        if (parentChildFriendCheckboxes[i].type === 'checkbox' && parentChildFriendCheckboxes[i].checked) {
            isPartnerChildFriend = true;
            break;
        }
        else if (parentChildFriendCheckboxes[i].type === 'number' && parentChildFriendCheckboxes[i].value > 0) {
            isPartnerChildFriend = true;
            break;
        }
    }

    if (!isPartnerChildFriend ) {
        sectionCount -= 1;
    }

    let counter = 0;
    let index = 0;
    while (counter < sectionCount) {
        if (!isPartnerChildFriend && allFormSections[index].id === 'inserted-partner-child-friends') {
            index += 1;
            continue;
        }
        else {
            const targetedElement = allFormSections[index].querySelector('.section-number > span');
            targetedElement.textContent =  `${counter+1}/${sectionCount}`;
            index += 1;
            counter += 1;
        }
    }
}

/* The start() function commences the execution of all code contained within this .js file. Per best
practice, the use of global variables has been minimised. */
function start() {
    /* Initialise values and add relevant event listeners to check whether or not
    boolean checkboxes (for yes or no questions) are checked. */
    const sections = document.querySelectorAll('.form-section');

    for (let i=0; i < sections.length; i++ ) {
        addCheckboxListener(sections[i]);
    }

    // Set default visibility for the interactive-list items and add event listeners to enable interactivity
    setCountryListVisibility();
    setCountryHeadingClickListener();
    setCountryListeners();

    document.querySelector('#country-selector-input').addEventListener('click', collectCountrySelections);

    // Add next button event listeners that validate input and only allow user to proceed if all tests passed
    const nextButtonContainers = document.querySelectorAll('.form-section');
    for (let i = 0; i < nextButtonContainers.length; i++) {
        nextButtonContainers[i].addEventListener('click', nextButtonEventHandler);
    }

    /*Add an event listener to the first form section's next button that enables partner, child
    and friend components to be dynamically added depending on the user's selections on this part 
    of the form. */
    const section1 = document.querySelector('.section-1 .next');
    section1.addEventListener('click', (e) => {
        managePartnerChildFriendComponents();
    });

    //Hide all form sections by default except the first
    const sectionsToHide = document.querySelectorAll('.form-section:not(.section-1)');
    for (let i = 0; i < sectionsToHide.length; i++) {
        sectionsToHide[i].classList.add('invisible');
    }

    //Add an event listener to all back buttons that hides the current section and dislays the previous one.
    const prevButtons = document.querySelectorAll('button.prev');
    for (let i=0; i < prevButtons.length; i++) {
        prevButtons[i].addEventListener('click', prevButtonClickHandler)
    }

    // Dynamically number each section of the form.
    setFormSectionNumbers();

}