import streamlit as st
import numpy as np
from bs4 import BeautifulSoup
import pandas as pd

st.set_page_config(
    page_title="brown gpa calc",
    page_icon=":bear:",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'Get Help': "mailto:raymond_yeo@brown.edu",
        'Report a bug': "mailto:raymond_yeo@brown.edu",
        'About': "# Made by Raymond Yeo, '23"
    }
)

if __name__ == "__main__":
    st.title(":teddy_bear: brown university _\~gpa\~_ calculator :school:")

    st.markdown("""---""")

    st.header("*step :one::* download transcript as an HTML file")

    col1, col2 = st.columns(2)

    # Add text to the left column
    with col1:
        st.header("option uno: my brown")
        st.markdown(""" 
        - Head over to https://my.brown.edu/web/guest/student
        - Student Records -> Unofficial Transcript
        - Right click -> Save As -> Format (HTML only)
        - Upload that HTML file below!
        """)
    # Add text to the right column
    with col2:
        st.header("option dos: self service")
        st.markdown("""
        - Head over to https://selfservice.brown.edu
        - Student -> Student Records -> Academic Transcript
        - Right click -> Save As -> Format (HTML only)
        - Upload that HTML file below!
        """)

    st.markdown("""---""")

    st.header("*step :two::* upload file")

    st.markdown("_privacy note: your transcripts are not saved on any disks, meaning they're discarded after use._")


    uploaded_file = st.file_uploader("Choose your HTML transcript file", type="html")

    st.markdown("""---""")

    st.header("*step :three::* customize grade options")

    st.write("Next, select grade calculation preferences. Make sure to hit submit.")

    # Create a checkbox with a default value of False
    option1 = st.checkbox("Treat an S* like an A :smiling_imp:", value=False)

    # Create a checkbox with a default value of True
    option2 = st.checkbox("Treat an S like an A... :see_no_evil: :hear_no_evil: :speak_no_evil:", value=False)

    option3 = st.checkbox("Weight Courses (i.e. a half credit course earns you half points, but counts as half a course) :weight_lifter:", value = True)

    st.markdown("""---""")


    # Create a button to submit the form
    st.header("*step :four::* calculate!")
    st.write("A = 4 points, B = 3 points, C = 2 points")
    submitted = st.button("Calculate GPA")


    if submitted and uploaded_file is not None:
        st.balloons()


        # Read the file as a string
        html_string = uploaded_file.read().decode("utf-8")

        soup = BeautifulSoup(html_string, 'lxml')

        course_department = [td.get_text(strip=True) for td in soup.find_all('td', attrs={'width': '20', 'align': 'left'})]
        course_code = [td.get_text(strip=True) for td in soup.find_all('td', attrs={'width': '40', 'align': 'left'})]
        course_name = [td.get_text(strip=True) for td in soup.find_all('td', attrs={'width': '305', 'align': 'left'})]
        course_grade = [td.get_text(strip=True) for td in soup.find_all('td', attrs={'width': '55', 'align': 'left'})]
        course_weight = [td.get_text(strip=True) for td in soup.find_all('td', attrs={'width': '60', 'align': 'right'})]

        # remove pre-reqs
        course_department = course_department[len(course_department) - len(course_code):]
        course_grade = course_grade[len(course_grade) - len(course_code):]


        # print(course_department)
        # print(course_code)
        # print(course_name)
        # print(course_grade)


        # only grab courses that one has gotten a grade for
        grade_dict = {"A": 4, "B": 3, "C":2}


        if option1:
            grade_dict["S*"] = 4
        if option2:
            grade_dict["S"] = 4


        total_points = 0
        total_completed_courses = 0
        counter = 0

        course_included = []


        if option3:
            for grade in course_grade:
                if grade not in grade_dict:
                    course_included.append(False)
                else:
                    total_points += grade_dict[grade] * float(course_weight[counter])
                    total_completed_courses += float(course_weight[counter])
                    course_included.append(True)
                counter += 1
        else:
            for grade in course_grade:
                if grade not in grade_dict:
                    course_included.append(False)
                else:
                    total_points += grade_dict[grade]
                    total_completed_courses += 1
                    course_included.append(True)
                counter += 1

        # calculate GPA
        GPA = total_points/total_completed_courses
        print(GPA)



        data_list = list(zip(course_department, course_code, course_name, course_grade, course_weight, course_included))


        df = pd.DataFrame(data_list, columns=['Department', 'Code', 'Course', 'Grade', 'Weight', 'Included in GPA'])

        st.header("Your GPA: " + str(round(GPA, 2)) + " :clap:")

        col3, col4, col5 = st.columns(3)
        with col3:
            st.write('Total Points: ' + str(total_points))
        with col4:
            st.write('Number of Classes Included in GPA: ' + str(total_completed_courses))
        with col5:
            st.write(str(total_points) + ' / ' + str(total_completed_courses) + ' = ' + str(round(GPA, 3)))
        st.table(df)
