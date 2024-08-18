// Function to handle form submission in post-job.html
function handleJobSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const job = {
        title: form['job-title'].value,
        company: form.company.value,
        location: form.location.value,
        jobType: form['job-type'].value,
        salary: form.salary.value,
        description: form.description.value,
        requirements: form.requirements.value,
        applicationInstructions: form['application-instructions'].value,
        contactEmail: form['contact-email'].value
    };
    
    // Store job in localStorage
    let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    jobs.push(job);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    
    // Show success message
    alert('Job posted successfully!');
    
    // Redirect to job-listing.html
    window.location.href = 'job-listing.html';
}

// Attach event listener to the form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('job-post-form');
    if (form) {
        form.addEventListener('submit', handleJobSubmission);
    }
});

// Function to create sample jobs
function createSampleJobs() {
    const sampleJobs = [
        {
            title: "Software Developer",
            company: "Tech Solutions Inc.",
            location: "San Francisco, CA",
            jobType: "Full-time",
            salary: "$80,000 - $120,000",
            description: "We are seeking a talented Software Developer to join our team...",
            requirements: "- Bachelor's degree in Computer Science or related field\n- 3+ years of experience in software development\n- Proficiency in JavaScript, Python, and SQL",
            applicationInstructions: "Please send your resume and cover letter to hiring@techsolutions.com",
            contactEmail: "hiring@techsolutions.com"
        },
        {
            title: "Marketing Manager",
            company: "Global Brands Co.",
            location: "New York, NY",
            jobType: "Full-time",
            salary: "$70,000 - $90,000",
            description: "We're looking for an experienced Marketing Manager to lead our marketing efforts...",
            requirements: "- Bachelor's degree in Marketing or related field\n- 5+ years of experience in marketing\n- Strong analytical and communication skills",
            applicationInstructions: "Apply online at www.globalbrands.com/careers",
            contactEmail: "careers@globalbrands.com"
        }
    ];

    localStorage.setItem('jobs', JSON.stringify(sampleJobs));
    return sampleJobs;
}

// Function to display jobs in job-listing.html
function displayJobs() {
    const jobListItems = document.getElementById('job-list-items');
    const jobDetails = document.getElementById('job-description');
    const adminControls = document.getElementById('admin-controls');
    
    // Get jobs from localStorage or create sample jobs if none exist
    let jobs = JSON.parse(localStorage.getItem('jobs'));
    if (!jobs || jobs.length === 0) {
        jobs = createSampleJobs();
    }
    
    // Clear existing job list
    jobListItems.innerHTML = '';
    
    // Display jobs in the list
    jobs.forEach((job, index) => {
        const li = document.createElement('li');
        li.className = 'job-item';
        li.dataset.jobId = index;
        li.innerHTML = `
            <h3 class="job-title">${job.title}</h3>
            <p class="company-name">${job.company}</p>
            <p class="job-location">${job.location}</p>
            <p class="salary-range">${job.salary}</p>
        `;
        li.addEventListener('click', () => showJobDetails(job, index));
        jobListItems.appendChild(li);
    });

    // Show details of the first job by default
    if (jobs.length > 0) {
        showJobDetails(jobs[0], 0);
    }

    // Show admin controls if logged in
    if (isAdminLoggedIn()) {
        adminControls.style.display = 'block';
        document.getElementById('admin-logout').addEventListener('click', adminLogout);
    } else {
        adminControls.style.display = 'none';
    }

    // Function to show job details
    function showJobDetails(job, jobId) {
        jobDetails.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
            <h4>Job Description:</h4>
            <p>${job.description}</p>
            <h4>Requirements:</h4>
            <p>${job.requirements}</p>
            <h4>How to Apply:</h4>
            <p>${job.applicationInstructions}</p>
            <p><strong>Contact:</strong> ${job.contactEmail}</p>
        `;

        if (isAdminLoggedIn()) {
            jobDetails.innerHTML += `
                <div class="admin-buttons">
                    <button onclick="editJob(${jobId})">Edit Job</button>
                    <button onclick="deleteJob(${jobId})">Delete Job</button>
                </div>
            `;
        }
    }
}

// Call displayJobs when the job listing page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('job-list')) {
        displayJobs();
    }
});

// User authentication functions
function handleSignUp(event) {
    event.preventDefault();
    const form = event.target;
    const user = {
        email: form.email.value,
        password: form.password.value
    };

    // Store user in localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Sign up successful! Please sign in.');
    window.location.href = 'signin.html';
}

function handleSignIn(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Sign in successful!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

function signOut() {
    localStorage.removeItem('currentUser');
    alert('You have been signed out.');
    window.location.href = 'index.html';
}

function updateNavigation() {
    const nav = document.querySelector('nav ul');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        // User is signed in
        nav.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="job-listing.html">Job Listings</a></li>
            <li><a href="post-job.html">Post a Job</a></li>
            <li><a href="#" id="sign-out">Sign Out</a></li>
            <li><a href="admin-login.html">Admin Login</a></li>
        `;
        document.getElementById('sign-out').addEventListener('click', signOut);
    } else {
        // User is not signed in
        nav.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="job-listing.html">Job Listings</a></li>
            <li><a href="post-job.html">Post a Job</a></li>
            <li><a href="signup.html">Sign Up</a></li>
            <li><a href="signin.html">Sign In</a></li>
            <li><a href="admin-login.html">Admin Login</a></li>
        `;
    }
}

// Admin functionality
const adminCredentials = {
    username: 'admin',
    password: 'adminpass123'
};

function handleAdminLogin(event) {
    event.preventDefault();
    const form = event.target;
    const username = form['admin-username'].value;
    const password = form['admin-password'].value;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        alert('Admin login successful!');
        window.location.href = 'job-listing.html';
    } else {
        alert('Invalid admin credentials');
    }
}

function isAdminLoggedIn() {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
}

function adminLogout() {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'index.html';
}

function editJob(jobId) {
    const jobs = JSON.parse(localStorage.getItem('jobs'));
    const job = jobs[jobId];
    // Implement edit functionality (e.g., populate a form with job details)
    console.log('Editing job:', job);
}

function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        let jobs = JSON.parse(localStorage.getItem('jobs'));
        jobs.splice(jobId, 1);
        localStorage.setItem('jobs', JSON.stringify(jobs));
        displayJobs();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUp);
    }

    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }

    // Attach event listener to the admin login form
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
});