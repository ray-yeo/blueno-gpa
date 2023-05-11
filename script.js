var courseGrade;
var courseDepartment;
var courseCode;
var courseName;
var courseWeight;


var option1Checkbox = document.getElementById('option1Checkbox');

// automatically check S* if S is checked
var option2Checkbox = document.getElementById('option2Checkbox');

option2Checkbox.addEventListener("change", function() {
    // If checkbox1 is checked, check checkbox2
    if (option2Checkbox.checked) {
        option1Checkbox.checked = true;
    }
    });


function processCourseGrade() {
    // Do something with the extracted information
    console.log("Course Grade:", courseGrade);

    // You can also call other functions or perform additional processing with courseGrade here
        // only grab courses that one has gotten a grade for
    var grade_dict = {"A": 4, "B": 3, "C":2};



    // Get the checkbox element by its id
    var option1Checkbox = document.getElementById('option1Checkbox');

    // Check if option1 is selected
    if (option1Checkbox.checked) {
        grade_dict["S*"] = 4;
        console.log('Option1 is selected');
    }

    // Get the checkbox element by its id
    var option2Checkbox = document.getElementById('option2Checkbox');

    // option2Checkbox.addEventListener("change", function() {
    //     // If checkbox1 is checked, check checkbox2
    //     if (option2Checkbox.checked) {
    //         option1Checkbox.checked = true;
    //         console.log('TESTING')
    //     }
    //   });

    // Check if option1 is selected
    if (option2Checkbox.checked) {
        grade_dict["S"] = 4;
        console.log('Option2 is selected');
        // Perform desired action for option1 being selected
    }

    // Get the checkbox element by its id
    var option3Checkbox = document.getElementById('option3Checkbox');

    var total_points = 0;
    var total_completed_courses = 0;
    var counter = 0;

    var course_included = [];



    if (option3Checkbox.checked) {
        console.log('Option3 is selected');
        for (var i = 0; i < courseGrade.length; i++) {
            if (!(courseGrade[i] in grade_dict)) {
            course_included.push(false);
            } else {
            total_points += grade_dict[courseGrade[i]] * parseFloat(courseWeight[counter]);
            total_completed_courses += parseFloat(courseWeight[counter]);
            course_included.push(true);
            }
            counter++;
        }
    } else {
        for (var i = 0; i < courseGrade.length; i++) {
            if (!(courseGrade[i] in grade_dict)) {
            course_included.push(false);
            } else {
            total_points += grade_dict[courseGrade[i]];
            total_completed_courses += 1;
            course_included.push(true);
            }
            counter++;
        }
    }
    // calculate GPA
    var GPA = total_points / total_completed_courses;
    let roundedNum = GPA.toFixed(2);
    console.log(roundedNum)
    document.getElementById("Stats").textContent = "Your Stats: ";

    document.getElementById("GPA").textContent = "GPA: " + roundedNum;


    // Build an HTML table with the courseName and courseGrade data
    var tableHtml = "<table><thead><tr><th> Course Name </th><th> Course Grade </th></tr></thead><tbody>";
    for (var i = 0; i < courseName.length; i++) {
        if (course_included[i]) {
            tableHtml += " <tr><td> " +  courseName[i] + " </td><td> " + courseGrade[i] + " </td></tr> ";
        }
    }
    tableHtml += "</tbody></table>";

    // Display the table on the page
    document.getElementById("Table Title").textContent = "Courses Included in GPA";
    document.getElementById("courseTable").innerHTML = tableHtml;
}

  

function calculateGPA() {
    var htmlString;

    var input = document.querySelector('input[name="uploaded_file"]');
    var uploadedFile = input.files[0]; // Assign the uploaded file to the variable

    if (!uploadedFile) {
        alert("No file selected");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var htmlString = e.target.result;

        // Create a new DOM parser
        var parser = new DOMParser();

        // Parse the HTML string into a Document object
        var doc = parser.parseFromString(htmlString, 'text/html');

        // Use BeautifulSoup-like syntax to select elements and extract information
        courseDepartment = Array.from(doc.querySelectorAll('td[width="20"][align="left"]')).map(td => td.textContent.trim());
        courseCode = Array.from(doc.querySelectorAll('td[width="40"][align="left"]')).map(td => td.textContent.trim());
        courseName = Array.from(doc.querySelectorAll('td[width="305"][align="left"]')).map(td => td.textContent.trim());
        courseGrade = Array.from(doc.querySelectorAll('td[width="55"][align="left"]')).map(td => td.textContent.trim());
        courseWeight = Array.from(doc.querySelectorAll('td[width="60"][align="right"]')).map(td => td.textContent.trim());
        console.log(courseGrade)

        processCourseGrade();
        const targetPosition = document.body.scrollHeight - window.innerHeight;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 1000; // in milliseconds
        let start = null;
      
        function animation(currentTime) {
          if (!start) {
            start = currentTime;
          }
          const timeElapsed = currentTime - start;
          const run = ease(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        }
      
        function ease(t, b, c, d) {
          t /= d / 2;
          if (t < 1) {
            return c / 2 * t * t + b;
          }
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        }
      
        requestAnimationFrame(animation);
    };
    reader.readAsText(uploadedFile);


}


// function scrollDown() {
//   window.scrollTo(0, document.body.scrollHeight);
// }