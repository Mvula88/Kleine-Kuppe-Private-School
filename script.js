// ===== Kleine Kuppe Private School Website JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileNav();
    initSmoothScroll();
    initStatsCounter();
    initRegistrationForm();
    initScrollAnimations();
    initScrollToTop();
});

// ===== Mobile Navigation =====
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const bannerHeight = document.querySelector('.demo-banner')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - bannerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Stats Counter Animation =====
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');

    if (stats.length === 0) return;

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    };

    // Intersection Observer for stats section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => animateCounter(stat));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ===== Registration Form =====
function initRegistrationForm() {
    const form = document.getElementById('registrationForm');
    const programSelect = document.getElementById('program');
    const sessionSection = document.getElementById('sessionSection');
    const subjectsSection = document.getElementById('subjectsSection');
    const submissionMethods = document.querySelectorAll('input[name="submissionMethod"]');
    const submitBtn = document.getElementById('submitBtn');
    const submitIcon = document.getElementById('submitIcon');
    const submitText = document.getElementById('submitText');

    if (!form) return;

    // Populate Date of Birth dropdowns
    populateDOBDropdowns();

    // Show/hide session and subjects based on program selection
    if (programSelect) {
        programSelect.addEventListener('change', function() {
            const isTutorial = this.value === 'Grade 12 Part-Time Tutorials';

            if (sessionSection) {
                sessionSection.style.display = isTutorial ? 'block' : 'none';
            }
            if (subjectsSection) {
                subjectsSection.style.display = isTutorial ? 'block' : 'none';
            }
        });
    }

    // Update submit button based on submission method
    submissionMethods.forEach(radio => {
        radio.addEventListener('change', function() {
            updateSubmitButton(this.value);
        });
    });

    function updateSubmitButton(method) {
        if (method === 'whatsapp') {
            submitIcon.className = 'fab fa-whatsapp';
            submitText.textContent = 'Submit via WhatsApp';
            submitBtn.classList.remove('email-mode');
            submitBtn.classList.add('whatsapp-mode');
        } else {
            submitIcon.className = 'fas fa-envelope';
            submitText.textContent = 'Submit via Email';
            submitBtn.classList.remove('whatsapp-mode');
            submitBtn.classList.add('email-mode');
        }
    }

    // Initialize button style
    updateSubmitButton('whatsapp');

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = collectFormData();

        // Get submission method
        const submissionMethod = document.querySelector('input[name="submissionMethod"]:checked')?.value || 'whatsapp';

        if (submissionMethod === 'whatsapp') {
            // Generate WhatsApp message
            const message = generateWhatsAppMessage(formData);
            const whatsappNumber = '264816725850';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } else {
            // Generate Email
            const emailData = generateEmailContent(formData);
            const mailtoUrl = `mailto:kleinekuppeps@gmail.com?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;

            // Create a temporary link and click it (more reliable than window.location)
            const tempLink = document.createElement('a');
            tempLink.href = mailtoUrl;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

            // Show confirmation message
            setTimeout(() => {
                alert('Your default email application should now open with your registration details.\n\nIf it did not open, please ensure you have an email application installed (like Outlook, Gmail app, etc.) or use the WhatsApp option instead.');
            }, 500);
        }
    });
}

// ===== Populate Date of Birth Dropdowns =====
function populateDOBDropdowns() {
    const daySelect = document.getElementById('dobDay');
    const yearSelect = document.getElementById('dobYear');

    if (!daySelect || !yearSelect) return;

    // Populate days (1-31)
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.textContent = i;
        daySelect.appendChild(option);
    }

    // Populate years (from 2026 down to 1950)
    const currentYear = 2026;
    for (let i = currentYear; i >= 1950; i--) {
        const option = document.createElement('option');
        option.value = i.toString();
        option.textContent = i;
        yearSelect.appendChild(option);
    }
}

// ===== Form Validation =====
function validateForm() {
    const form = document.getElementById('registrationForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        // Remove previous error styling
        field.classList.remove('error');

        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        }

        // Special validation for checkboxes
        if (field.type === 'checkbox' && !field.checked) {
            field.closest('.checkbox-label')?.classList.add('error');
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        }
    });

    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('error');
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = emailField;
            }
        }
    }

    // Scroll to first invalid field
    if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidField.focus();
        alert('Please fill in all required fields correctly.');
    }

    return isValid;
}

// ===== Collect Form Data =====
function collectFormData() {
    const form = document.getElementById('registrationForm');

    // Get selected subjects
    const subjects = [];
    form.querySelectorAll('input[name="subjects"]:checked').forEach(checkbox => {
        subjects.push(checkbox.value);
    });

    // Get session preference
    const sessionInput = form.querySelector('input[name="session"]:checked');
    const session = sessionInput ? sessionInput.value : 'N/A';

    // Format date of birth from dropdowns
    const dobDay = document.getElementById('dobDay')?.value;
    const dobMonth = document.getElementById('dobMonth')?.value;
    const dobYear = document.getElementById('dobYear')?.value;
    let formattedDob = 'N/A';

    if (dobDay && dobMonth && dobYear) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = parseInt(dobMonth) - 1;
        formattedDob = `${parseInt(dobDay)} ${monthNames[monthIndex]} ${dobYear}`;
    }

    return {
        program: document.getElementById('program')?.value || 'N/A',
        fullName: document.getElementById('fullName')?.value || 'N/A',
        idNumber: document.getElementById('idNumber')?.value || 'N/A',
        dob: formattedDob,
        gender: document.getElementById('gender')?.value || 'N/A',
        phone: document.getElementById('phone')?.value || 'N/A',
        email: document.getElementById('email')?.value || 'N/A',
        parentName: document.getElementById('parentName')?.value || 'N/A',
        relationship: document.getElementById('relationship')?.value || 'N/A',
        parentPhone: document.getElementById('parentPhone')?.value || 'N/A',
        parentEmail: document.getElementById('parentEmail')?.value || 'N/A',
        previousSchool: document.getElementById('previousSchool')?.value || 'N/A',
        gradeCompleted: document.getElementById('gradeCompleted')?.value || 'N/A',
        session: session,
        subjects: subjects,
        hostel: document.getElementById('hostel')?.checked ? 'Yes' : 'No',
        additionalInfo: document.getElementById('additionalInfo')?.value || 'None'
    };
}

// ===== Generate WhatsApp Message =====
function generateWhatsAppMessage(data) {
    let message = `*ONLINE REGISTRATION*
Kleine Kuppe Private School
==============================

*PROGRAM*
${data.program}

*PERSONAL DETAILS*
Full Name: ${data.fullName}
ID Number: ${data.idNumber}
Date of Birth: ${data.dob}
Gender: ${data.gender}
Phone: ${data.phone}
Email: ${data.email}

*PARENT/GUARDIAN DETAILS*
Name: ${data.parentName}
Relationship: ${data.relationship}
Phone: ${data.parentPhone}
Email: ${data.parentEmail || 'N/A'}

*PREVIOUS SCHOOL*
School: ${data.previousSchool || 'N/A'}
Last Grade: ${data.gradeCompleted || 'N/A'}`;

    // Add session and subjects for tutorials
    if (data.program === 'Grade 12 Part-Time Tutorials') {
        message += `

*SESSION PREFERENCE*
${data.session}`;

        if (data.subjects.length > 0) {
            message += `

*SUBJECTS REGISTERED FOR*`;
            data.subjects.forEach((subject, index) => {
                message += `
${index + 1}. ${subject}`;
            });
            message += `
Total: ${data.subjects.length} subject(s)`;
        }
    }

    message += `

*ACCOMMODATION*
Hostel Required: ${data.hostel}

*ADDITIONAL INFORMATION*
${data.additionalInfo}

==============================
Submitted via Online Registration Form
Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
Time: ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

    return message;
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .program-card, .gallery-item');

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

// ===== Generate Email Content =====
function generateEmailContent(data) {
    const subject = `Online Registration - ${data.fullName} (${data.program})`;

    let body = `ONLINE REGISTRATION
Kleine Kuppe Private School
==============================

PROGRAM
${data.program}

PERSONAL DETAILS
Full Name: ${data.fullName}
ID Number: ${data.idNumber}
Date of Birth: ${data.dob}
Gender: ${data.gender}
Phone: ${data.phone}
Email: ${data.email}

PARENT/GUARDIAN DETAILS
Name: ${data.parentName}
Relationship: ${data.relationship}
Phone: ${data.parentPhone}
Email: ${data.parentEmail || 'N/A'}

PREVIOUS SCHOOL
School: ${data.previousSchool || 'N/A'}
Last Grade: ${data.gradeCompleted || 'N/A'}`;

    // Add session and subjects for tutorials
    if (data.program === 'Grade 12 Part-Time Tutorials') {
        body += `

SESSION PREFERENCE
${data.session}`;

        if (data.subjects.length > 0) {
            body += `

SUBJECTS REGISTERED FOR`;
            data.subjects.forEach((subject, index) => {
                body += `
${index + 1}. ${subject}`;
            });
            body += `
Total: ${data.subjects.length} subject(s)`;
        }
    }

    body += `

ACCOMMODATION
Hostel Required: ${data.hostel}

ADDITIONAL INFORMATION
${data.additionalInfo}

==============================
Submitted via Online Registration Form
Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
Time: ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

    return { subject, body };
}

// ===== Scroll to Top Button =====
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('a');
    scrollBtn.href = '#';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Smooth scroll to top
    scrollBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Add Error Styling =====
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1) !important;
    }

    .checkbox-label.error {
        border-color: #e74c3c !important;
        background-color: rgba(231, 76, 60, 0.05) !important;
    }

    .checkbox-label.error .checkbox-custom {
        border-color: #e74c3c !important;
    }
`;
document.head.appendChild(style);

// ===== Navbar scroll effect =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    }
});
