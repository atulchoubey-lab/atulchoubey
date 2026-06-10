import os
import json
import re
import shutil
import subprocess
import urllib.request
import urllib.error

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("PIL not available — using default image dimensions (Vercel-compatible mode)")

# Config and Constants
RESUME_TEXT_PATH = "Data/Resume/parsed_resume.txt"
PUBLIC_DIR = "public"
IMAGES_DIR = "public/images"
CERTIFICATES_DIR = "public/certificates"
SRC_DATA_DIR = "src/data"

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(CERTIFICATES_DIR, exist_ok=True)
os.makedirs(SRC_DATA_DIR, exist_ok=True)

# 1. Helper slugify function
def slugify(s):
    s = s.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')

def get_image_dims(image_path):
    """Return (width, height, orientation). Uses PIL if available, else returns safe defaults."""
    if PIL_AVAILABLE:
        try:
            with Image.open(image_path) as img:
                w, h = img.size
                ratio = w / h
                if ratio > 1.25: orient = "landscape"
                elif ratio < 0.80: orient = "portrait"
                else: orient = "square"
                return w, h, orient
        except Exception:
            pass
    return 1200, 800, "landscape"

# Photo metadata — single source of truth for all images
SLUG_MAPPINGS = {
    "cit": {
        "title": "Coimbatore Institute of Technology",
        "description": "My B.Tech college campus in Coimbatore, Tamil Nadu.",
        "category": "Personal", "display_section": "journey",
        "featured": True, "exclude_from_gallery": True, "display_priority": 2
    },
    "me-in-chath-puja": {
        "title": "Celebrating Chhath Puja",
        "description": "Observing traditional Chhath Puja rituals in Patna, keeping our family heritage alive.",
        "category": "Family", "display_section": "gallery",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    "me-with-mom-in-rameshwaram-temple": {
        "title": "Rameshwaram Temple with Maa",
        "description": "A sacred visit to Rameshwaram Temple in Tamil Nadu with my mother, Smt. Anita Choubey.",
        "category": "Family", "display_section": "gallery",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    "me-with-mom": {
        "title": "With My Mother",
        "description": "A warm and cherished moment with my mother, Smt. Anita Choubey.",
        "category": "Family", "display_section": "gallery",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    "me-with-my-father-add-this-photo-in-family-intro": {
        "title": "With My Father",
        "description": "A meaningful photograph with my father, Shri Manoranjan Choubey.",
        "category": "Family", "display_section": "family",
        "featured": True, "exclude_from_gallery": False, "display_priority": 1
    },
    "me-with-my-father": {
        "title": "With My Father",
        "description": "A photograph with my father, Shri Manoranjan Choubey.",
        "category": "Family", "display_section": "family",
        "featured": True, "exclude_from_gallery": False, "display_priority": 1
    },
    "papa-profile-photo": {
        "title": "Shri Manoranjan Choubey",
        "description": "My father, Shri Manoranjan Choubey, Income Tax Advocate.",
        "category": "Family", "display_section": "family",
        "featured": True, "exclude_from_gallery": True, "display_priority": 1
    },
    "me-with-my-grandfather-sk-choubey-who-was-a-retired-irs-officer": {
        "title": "With My Grandfather",
        "description": "With my late grandfather, Shri SK Choubey, a retired IRS Officer.",
        "category": "Family", "display_section": "family",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    "family-photo-at-mahavir-mandir-patna": {
        "title": "Family at Mahavir Mandir, Patna",
        "description": "A blessed family visit to the sacred Mahavir Mandir temple in Patna.",
        "category": "Family", "display_section": "gallery",
        "featured": True, "exclude_from_gallery": False, "display_priority": 1
    },
    "profile-photo": {
        "title": "Professional Portrait",
        "description": "My professional profile photograph.",
        "category": "Personal", "display_section": "hero",
        "featured": True, "exclude_from_gallery": True, "display_priority": 1
    },
    "rahul-profile-photo": {
        "title": "Rahul Choubey",
        "description": "My brother, Rahul Choubey, Advocate.",
        "category": "Family", "display_section": "family",
        "featured": True, "exclude_from_gallery": True, "display_priority": 1
    },
    "mom-profile-photo": {
        "title": "Smt. Anita Choubey",
        "description": "My mother, Smt. Anita Choubey, Homemaker.",
        "category": "Family", "display_section": "family",
        "featured": True, "exclude_from_gallery": True, "display_priority": 1
    },
    "rock-band-performance-at-bosch-employees-interstate-competition": {
        "title": "Rock Band Performance",
        "description": "Performing live on guitar with our rock band at the Bosch employees interstate music competition.",
        "category": "Lifestyle", "display_section": "journey",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    "ubs-pune": {
        "title": "UBS Office, Pune",
        "description": "The campus in Pune where I work on MLOps and AI platforms.",
        "category": "Personal", "display_section": "journey",
        "featured": True, "exclude_from_gallery": True, "display_priority": 2
    },
    "adiyogi-shiva-statue-coimbatore-tamil-nadu-city-1-hero": {
        "title": "Adiyogi, Coimbatore",
        "description": "The iconic Adiyogi Shiva statue near Coimbatore — a memorable place from my engineering years.",
        "category": "Lifestyle", "display_section": "journey",
        "featured": True, "exclude_from_gallery": True, "display_priority": 2
    },
    "bosch-building": {
        "title": "Bosch Office, Coimbatore",
        "description": "The Bosch Global Software Technology campus in Coimbatore where I worked as a Senior DevOps Engineer.",
        "category": "Personal", "display_section": "journey",
        "featured": True, "exclude_from_gallery": True, "display_priority": 2
    },
    "me-with-my-brother-grand-father-and-grand-mother": {
        "title": "With Brother & Grandparents",
        "description": "A treasured family photograph with my brother Rahul Choubey and our grandparents.",
        "category": "Family", "display_section": "gallery",
        "featured": False, "exclude_from_gallery": False, "display_priority": 3
    },
    "me-with-my-mom-in-isha-yoga": {
        "title": "At Isha Yoga with Maa",
        "description": "A peaceful and spiritual journey to the Isha Yoga Center with my mother.",
        "category": "Family", "display_section": "gallery",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    "me-with-my-pug-muffy": {
        "title": "My Pug, Muffy",
        "description": "A happy moment with my beloved pug dog, Muffy.",
        "category": "Lifestyle", "display_section": "gallery",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    "me": {
        "title": "Atul Choubey",
        "description": "A candid portrait.",
        "category": "Personal", "display_section": "about",
        "featured": True, "exclude_from_gallery": False, "display_priority": 1
    },
    "me2": {
        "title": "In My Element",
        "description": "A candid personal moment reflecting focus and energy.",
        "category": "Personal", "display_section": "gallery",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    "me-for-journey": {
        "title": "Guitar & Leisure",
        "description": "Playing acoustic guitar during my leisure hours in early career days.",
        "category": "Lifestyle", "display_section": "journey",
        "featured": True, "exclude_from_gallery": True, "display_priority": 1
    },
    "me-school-time": {
        "title": "School Days in Patna",
        "description": "A throwback from my school days at Radiant School in Patna.",
        "category": "Personal", "display_section": "journey",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    "me-at-kalycito-office-early-days": {
        "title": "Early Days at Kalycito",
        "description": "At the Kalycito Infotech office in Coimbatore during my early career as a DevOps engineer.",
        "category": "Personal", "display_section": "journey",
        "featured": True, "exclude_from_gallery": True, "display_priority": 1
    },
    "my-car": {
        "title": "Road Trips & Travel",
        "description": "My car — a symbol of my love for road trips and exploring new places.",
        "category": "Lifestyle", "display_section": "gallery",
        "featured": False, "exclude_from_gallery": False, "display_priority": 3
    },
    "my-guitar": {
        "title": "Playing Guitar",
        "description": "Strumming my acoustic guitar — music is one of my greatest passions.",
        "category": "Lifestyle", "display_section": "gallery",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    "me-with-guitar": {
        "title": "Guitar Sessions",
        "description": "Playing acoustic guitar — music keeps me grounded.",
        "category": "Lifestyle", "display_section": "gallery",
        "featured": True, "exclude_from_gallery": False, "display_priority": 2
    },
    # Legacy/raw files from initial commit — hidden from gallery
    "382863b1-aefa-4dff-b278-a8778022be94": {
        "title": "Personal Moment", "description": "A personal photograph.",
        "category": "Personal", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_0175": {
        "title": "Family Gathering", "description": "A cherished moment with family.",
        "category": "Family", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_0468": {
        "title": "A Memorable Day", "description": "A meaningful personal moment.",
        "category": "Personal", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_0493": {
        "title": "Family Time", "description": "A warm family moment.",
        "category": "Family", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_0501": {
        "title": "A Personal Moment", "description": "A candid personal photograph.",
        "category": "Personal", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_0503": {
        "title": "With Family", "description": "A moment with family.",
        "category": "Family", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_0553": {
        "title": "A Cherished Moment", "description": "A personal photograph.",
        "category": "Personal", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_2004_Original": {
        "title": "A Special Occasion", "description": "A memorable personal moment.",
        "category": "Personal", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_2549": {
        "title": "With Loved Ones", "description": "A treasured moment.",
        "category": "Family", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_2614": {
        "title": "A Memorable Moment", "description": "A personal photograph.",
        "category": "Personal", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_2670": {
        "title": "Family Time", "description": "A warm moment with family.",
        "category": "Family", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_2677": {
        "title": "A Personal Day", "description": "A candid personal photograph.",
        "category": "Personal", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "IMG_4696": {
        "title": "Special Gathering", "description": "A meaningful family moment.",
        "category": "Family", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "Profile_Photo": {
        "title": "Portrait", "description": "A personal portrait.",
        "category": "Personal", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
    "afd5d20d-4501-4d07-835c-d411c97e4461_Original": {
        "title": "A Personal Photograph", "description": "A personal photograph.",
        "category": "Personal", "display_section": "hidden",
        "featured": False, "exclude_from_gallery": True, "display_priority": 99
    },
}

def build_photo_entry(slug, dest_path):
    """Build a photo metadata dict for a given slug and file path."""
    width, height, orientation = get_image_dims(dest_path)
    m = SLUG_MAPPINGS.get(slug, {
        "title": slug.replace('-', ' ').title(),
        "description": "A personal photograph.",
        "category": "Personal", "display_section": "gallery",
        "featured": False, "exclude_from_gallery": False, "display_priority": 3
    })
    return {
        "id": f"photo_{slug}",
        "src": f"/images/{slug}.jpg",
        "title": m["title"],
        "description": m["description"],
        "category": m["category"],
        "width": width,
        "height": height,
        "orientation": orientation,
        "featured": m["featured"],
        "display_section": m["display_section"],
        "display_priority": m["display_priority"],
        "exclude_from_gallery": m["exclude_from_gallery"],
    }

# 2. Convert and Copy Images from Data/images/
def process_images():
    data_images_dir = "Data/images"
    photos_metadata = []
    existing_slugs = set()

    # Vercel / CI mode: Data/images/ not available — build from public/images/ directly
    if not os.path.exists(data_images_dir):
        print("Data/images not found — building manifest from public/images/ (Vercel mode)")
        if not os.path.exists(IMAGES_DIR):
            return photos_metadata
        for filename in sorted(os.listdir(IMAGES_DIR)):
            if filename.startswith(".") or not filename.lower().endswith(".jpg"):
                continue
            slug = os.path.splitext(filename)[0]
            if slug in existing_slugs:
                continue
            existing_slugs.add(slug)
            dest_path = os.path.join(IMAGES_DIR, filename)
            photos_metadata.append(build_photo_entry(slug, dest_path))
        print(f"Vercel mode: found {len(photos_metadata)} images in public/images/")
        return photos_metadata
        
    for filename in sorted(os.listdir(data_images_dir)):
        if filename.startswith("."):
            continue
            
        src_path = os.path.join(data_images_dir, filename)
        if not os.path.isfile(src_path):
            continue
            
        ext = os.path.splitext(filename)[1].lower()
        if ext not in [".heic", ".jpeg", ".jpg", ".png"]:
            continue
            
        # Determine Slug & Destination Name
        slug = slugify(os.path.splitext(filename)[0])
            
        dest_filename = f"{slug}.jpg"
        dest_path = os.path.join(IMAGES_DIR, dest_filename)
        
        # Convert HEIC to JPG or Copy JPG/PNG
        if ext == ".heic":
            try:
                # Convert using sips on macOS
                subprocess.run(
                    ["sips", "-s", "format", "jpeg", src_path, "--out", dest_path],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    check=True
                )
            except Exception as e:
                print(f"Error converting HEIC image {filename}: {e}")
                continue
        else:
            try:
                shutil.copy2(src_path, dest_path)
            except Exception as e:
                print(f"Error copying image {filename}: {e}")
                continue
                
        # Build metadata from module-level SLUG_MAPPINGS
        photos_metadata.append(build_photo_entry(slug, dest_path))
        existing_slugs.add(slug)

    print(f"Processed {len(photos_metadata)} images from Data/images/")
    return photos_metadata

# 3. Process certificates from Data/6. Educational Document/
def process_certificates():
    cert_metadata = []
    
    cert_src_dir = "Data/6. Educational Document/Certificate"
    marksheet_src_dir = "Data/6. Educational Document/Marksheets"
    
    # Check if files exist and copy them
    files_to_copy = [
        (os.path.join(cert_src_dir, "CIT_ATUL_DEGREE.jpg"), "cit-atul-degree.jpg"),
        (os.path.join(cert_src_dir, "Provisional Certificate.jpeg"), "provisional-certificate.jpg"),
        (os.path.join(marksheet_src_dir, "CLASS 12TH RESULT 2015.jpg"), "class-12th-result-2015.jpg"),
        (os.path.join(marksheet_src_dir, "10th marksheet.pdf"), "10th-marksheet.pdf"),
    ]
    
    for src, name in files_to_copy:
        if os.path.exists(src):
            try:
                shutil.copy2(src, os.path.join(CERTIFICATES_DIR, name))
            except Exception as e:
                print(f"Error copying certificate {src}: {e}")
                
    # Define Certifications Structured Data
    cert_metadata = [
        {
            "id": "cit_degree",
            "name": "Bachelor of Technology in Information Technology",
            "issuer": "Coimbatore Institute of Technology",
            "date": "September 2020",
            "credential_id": "Anna University - First Class Passing",
            "src": "/certificates/cit-atul-degree.jpg",
            "type": "Degree",
            "verified": True
        },
        {
            "id": "provisional_cert",
            "name": "Provisional B.Tech IT Degree Certificate",
            "issuer": "Anna University, Chennai",
            "date": "September 2020",
            "credential_id": "Register No. 1605011 (Autonomous)",
            "src": "/certificates/provisional-certificate.jpg",
            "type": "Degree",
            "verified": True
        },
        {
            "id": "class_12_marksheet",
            "name": "CBSE Class XII Certificate & Marksheet",
            "issuer": "Central Board of Secondary Education (CBSE)",
            "date": "May 2015",
            "credential_id": "Science Stream - Passed (Radiant School)",
            "src": "/certificates/class-12th-result-2015.jpg",
            "type": "Marksheet",
            "verified": True
        },
        {
            "id": "class_10_marksheet",
            "name": "CBSE Class X Certificate & Marksheet",
            "issuer": "Central Board of Secondary Education (CBSE)",
            "date": "May 2013",
            "credential_id": "9.2 CGPA - Passed (Radiant School)",
            "src": "/certificates/10th-marksheet.pdf",
            "type": "Marksheet",
            "verified": True
        },
    ]
    return cert_metadata

# 4. Load Resume content
resume_text = ""
if os.path.exists(RESUME_TEXT_PATH):
    with open(RESUME_TEXT_PATH, "r", encoding="utf-8") as f:
        resume_text = f.read()

# 5. Populate Photos and Certificates
photos_list = process_images()
certs_list = process_certificates()

# 6. Define Master Memory Graph
profile_data = {
    "personal": {
        "name": "Atul Choubey",
        "dob": "1997-03-15",
        "birth_display": "15th March 1997",
        "birth_place": "Patna, Bihar",
        "age": 29,  # Compiled dynamically relative to 2026 local time
        "height": "5'7\"",
        "gothra": "Bhargav",
        "rashi": "Meena (Pisces)",
        "native_place": "Ahirauli, Buxar, Bihar",
        "current_city": "Pune, India",
        "email": "cse.atul.choubey@gmail.com",
        "phone": "+91-9142758697",
        "linkedin": "linkedin.com/in/atul-choubey-1341a4375",
        "github": "github.com/atulchoubey",
    },
    "education": {
        "ug": {
            "degree": "B.Tech",
            "specialization": "Information Technology",
            "institute": "Coimbatore Institute of Technology, Coimbatore",
            "university": "Anna University (Autonomous)",
            "classification": "First Class",
            "passing_year": "2020",
            "period": "2016 - 2020",
        },
        "hsc": {
            "board": "CBSE",
            "school": "Radiant International School, Patna, Bihar",
            "passing_year": "2015",
            "result": "Passed",
        },
        "sslc": {
            "board": "CBSE",
            "school": "Radiant International School, Patna, Bihar",
            "passing_year": "2013",
            "cgpa": "9.2",
        }
    },
    "career": [
        {
            "role": "Senior MLOps / ML Platform Engineer",
            "company": "Accenture (Client: UBS)",
            "period": "01/2025 - Present",
            "location": "Pune, India",
            "description": [
                "Architect configuration-driven ML training and deployment pipelines using GitLab CI/CD, CDSW, and MLflow for automated versioning and tracking.",
                "Redesign model pipelines from branch-per-model to single parameterized CI/CD system, enabling N-model × M-environment deployments.",
                "Develop 'aes_cdsw_api', an internal Python library abstracting CDSW deployment APIs to standardize model releases from GitLab CI.",
                "Design dual-workspace Azure ML promotion architectures (training + inference) with Ansible-based orchestration and uv package management."
            ],
            "skills": ["Azure ML", "MLflow", "GitLab CI", "Ansible", "Python", "Kubernetes", "uv"],
            "logoColor": "from-purple-600 to-indigo-600"
        },
        {
            "role": "Senior Software Engineer – DevOps & Python Automation",
            "company": "Bosch Global Software Technology",
            "period": "01/2023 - 12/2024",
            "location": "Coimbatore, Tamil Nadu",
            "description": [
                "Built Python automation integrating RTC, RQM, and Jenkins REST APIs to stream operational build metrics into Grafana and InfluxDB.",
                "Maintained over 50 CI build pipelines, reducing resolution times to ~20 minutes through python-based automated triage tooling.",
                "Developed data ingestion utilities for large-scale enterprise build infrastructures, improving workflow observability."
            ],
            "skills": ["Python", "Jenkins", "Grafana", "InfluxDB", "RTC", "REST", "Git"],
            "logoColor": "from-blue-500 to-sky-500"
        },
        {
            "role": "DevOps & Platform Engineer",
            "company": "Kalycito Infotech",
            "period": "10/2020 - 12/2022",
            "location": "Coimbatore, Tamil Nadu",
            "description": [
                "Deployed and managed multi-node Kubernetes clusters supporting 20+ containerized services at 99.9% uptime.",
                "Configured autoscaling, resource quotas, and workload scheduling parameters.",
                "Built Docker packaging pipelines for consistent containerized deployments and developed Python test scripts."
            ],
            "skills": ["Kubernetes", "Docker", "Python", "Linux", "Git", "Bash"],
            "logoColor": "from-emerald-500 to-teal-500"
        }
    ],
    "skills": ["Python", "Azure ML", "MLflow", "GitLab CI", "Kubernetes", "Ansible", "Bash", "SQL", "YAML", "PyTorch", "Scikit-Learn", "Jenkins", "Docker", "Git", "Linux", "Grafana", "InfluxDB", "REST", "Node.js", "uv"],
    "projects": [
        {
            "title": "Config-Driven ML Platform",
            "description": "Configuration-driven ML platform using GitLab CI/CD + CDSW + Azure ML for automating training pipelines. Replaced manual releases with fully automated pipelines via aes_cdsw_api.",
            "period": "01/2024 - 12/2025"
        },
        {
            "title": "Python API Integration & CI Metrics Automation",
            "description": "Automated data collection for 50+ build pipelines integrating RTC, RQM, and Jenkins REST APIs to stream real-time metrics to Grafana/InfluxDB.",
            "period": "01/2023 - 12/2024"
        }
    ],
    "family": {
        "father": {
            "name": "Shri Manoranjan Choubey",
            "occupation": "Income Tax Advocate",
            "details": "Guiding the family with legal and ethical values."
        },
        "mother": {
            "name": "Smt. Anita Choubey",
            "occupation": "Homemaker",
            "details": "Preserving traditional customs and anchoring the home."
        },
        "brother": {
            "name": "Rahul Choubey",
            "occupation": "Advocate",
            "details": "Advocating law, justice, and family values."
        },
        "grandfather": {
            "name": "Shri S.K. Choubey",
            "occupation": "Retired IRS Officer",
            "details": "Inspiring dedication, administrative discipline, and service to society."
        },
        "roots": {
            "village": "Ahirauli",
            "district": "Buxar",
            "state": "Bihar",
            "gotra": "Bhargav"
        },
        "values": [
            "Integrity",
            "Education",
            "Respect",
            "Tradition",
            "Continuous Growth",
            "Family First"
        ]
    },
    "lifestyle": {
        "routine": [
            {"time": "05:30 AM", "activity": "Wake Up", "detail": "Morning mindfulness and planning"},
            {"time": "06:00 AM - 07:30 AM", "activity": "Gym", "detail": "Strength and physical conditioning"},
            {"time": "09:00 AM - 06:00 PM", "activity": "Work", "detail": "MLOps pipelines and infrastructure"},
            {"time": "07:00 PM - 08:30 PM", "activity": "Upskilling", "detail": "Learning research papers and coding"},
            {"time": "09:00 PM - 10:00 PM", "activity": "Family", "detail": "Connecting with parents and brother"},
            {"time": "10:30 PM", "activity": "Rest", "detail": "Sleep and recharging"}
        ],
        "hobbies": ["Physical Fitness", "Technical Reading", "Travel & Cultural Discovery", "Playing Acoustic Guitar", "Playing with his pet pug Muffy"],
        "values_philosophy": "Discipline is the foundation of mental performance, career achievement, and family harmony."
    },
    "goals": [
        {"title": "AI & Infrastructure Leadership", "time": "1-3 Years", "category": "professional"},
        {"title": "Supporting Parents (Healthcare & comfort)", "time": "Ongoing", "category": "family"},
        {"title": "Financial Independence", "time": "3-5 Years", "category": "financial"},
        {"title": "Healthy Values-driven Family", "time": "1-2 Years", "category": "family"},
        {"title": "Continuous Learning & Upskilling", "time": "Ongoing", "category": "personal"}
    ],
    "marriage_preferences": {
        "expectations": "Looking for an educated, family-oriented, respectful, and ambitious partner who values mutual growth, integrity, and cultural roots.",
        "outlook": "A healthy marriage is built on mutual support, trust, and shared values."
    },
    "photos": photos_list,
    "certificates": certs_list
}

# 7. Generate RAG Chunks dynamically from Memory Graph (Chatbot learns everything from website)
chunks = []

# Personal Info Chunk
_p = profile_data["personal"]
chunks.append({
    "id": "chunk_personal",
    "category": "personal",
    "title": "Personal Details & Background",
    "text": f"I am a {_p['age']}-year-old MLOps Engineer born in {_p['birth_place']} on {_p['birth_display']}. I stand {_p['height']} tall, belong to the {_p['gothra']} Gotra, and my zodiac sign (Rashi) is {_p['rashi']}. I am originally from {_p['native_place']}, and currently live in {_p['current_city']}. I value discipline, continuous learning, and family."
})

# Education Chunks
edu_str = f"I hold a Bachelor of Technology (B.Tech) in Information Technology from Coimbatore Institute of Technology (Anna University), graduating in September 2020 with First Class honors (collegiate period 2016-2020). I completed CBSE Class XII in 2015 and CBSE Class X in 2013 with 9.2 CGPA at Radiant International School in Patna, Bihar."
chunks.append({
    "id": "chunk_education",
    "category": "education",
    "title": "Educational Qualification",
    "text": edu_str
})

# Career Chunks
for idx, job in enumerate(profile_data["career"]):
    desc_str = " ".join(job["description"])
    chunks.append({
        "id": f"chunk_career_{idx}",
        "category": "career",
        "title": f"Professional Role: {job['role']} at {job['company']}",
        "text": f"I worked as a {job['role']} at {job['company']} in {job['location']} during {job['period']}. Description of my duties: {desc_str} Skills I utilized: {', '.join(job['skills'])}."
    })

# Skills and Projects Chunk
chunks.append({
    "id": "chunk_skills_projects",
    "category": "career",
    "title": "Skills and Projects Summary",
    "text": f"I have over 6 years of experience in MLOps, DevOps, and Python automation. My technical skills include: {', '.join(profile_data['skills'])}. Featured projects: 1) Config-Driven ML Platform (GitLab CI/CD + CDSW + Azure ML) from 2024-2025. 2) Python API Integration & CI Metrics Automation at Bosch from 2023-2024."
})

# Family Chunk
family_info = "I come from a Brahmin family originally from Ahirauli village in Buxar district, Bihar. My father, Shri Manoranjan Choubey, is an Income Tax Advocate. My mother, Anita Choubey, is a homemaker and has always been a strong source of love and support for our family. My brother, Rahul Choubey, is an Advocate. My grandfather, Shri SK Choubey, was a retired IRS Officer. Our family Gotra is Bhargav, and our values are rooted in integrity, education, respect, and tradition."
chunks.append({
    "id": "chunk_family",
    "category": "family",
    "title": "Family Background, Roots and Values",
    "text": family_info
})

# Lifestyle Chunk
lifestyle_info = f"I follow a highly disciplined daily schedule: waking up at 5:30 AM, working out at the gym from 6:00 to 7:30 AM, engineering MLOps systems from 9:00 AM to 6:00 PM, upskilling and learning research papers from 7:00 to 8:30 PM, connecting with my family from 9:00 to 10:00 PM, and resting by 10:30 PM. Hobbies include physical fitness, technical reading, travel & cultural discovery, playing acoustic guitar, and playing with my pet pug dog Muffy."
chunks.append({
    "id": "chunk_lifestyle",
    "category": "lifestyle",
    "title": "Lifestyle, Hobbies and Daily Routine",
    "text": lifestyle_info
})

# Goals Chunk
goals_str = " ".join([f"- {g['title']} ({g['time']}, {g['category']})" for g in profile_data["goals"]])
chunks.append({
    "id": "chunk_goals",
    "category": "goals",
    "title": "Future Aspirations and Goals",
    "text": f"My personal and professional roadmaps include: {goals_str}."
})

# Matrimonial expectations
chunks.append({
    "id": "chunk_matrimonial",
    "category": "matrimonial",
    "title": "Marriage Expectations and Life Partner Preferences",
    "text": f"I am looking for a life partner who is educated, family-oriented, respectful, and ambitious, valuing mutual trust, emotional support, and shared family roots. I believe a healthy marriage is built on mutual support, trust, and shared values."
})

# Photo Stories Chunk
photo_str = " ".join([f"- {p['title']}: {p['description']} ({p['category']})" for p in photos_list])
chunks.append({
    "id": "chunk_photos",
    "category": "gallery",
    "title": "Photo Gallery & Travel Stories",
    "text": f"My website features a storytelling photo gallery: {photo_str}."
})

# Certifications Chunk
cert_str = " ".join([f"- {c['name']} issued by {c['issuer']} on {c['date']} (Credential: {c['credential_id']})" for c in certs_list])
chunks.append({
    "id": "chunk_certificates",
    "category": "education",
    "title": "Verified Certificates and Marksheets",
    "text": f"My verified certificates and documents include: {cert_str}."
})

# 8. Helper: TF-IDF Text Vectorization (Local fallback RAG search)
def compute_tf_idf(text):
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    stopwords = {'the', 'and', 'for', 'that', 'with', 'this', 'from', 'this', 'was', 'were', 'been', 'has', 'have'}
    words = [w for w in words if w not in stopwords]
    
    tf = {}
    for w in words:
        tf[w] = tf.get(w, 0) + 1
        
    length = sum(tf.values())
    if length > 0:
        for w in tf:
            tf[w] = round(tf[w] / length, 4)
            
    return tf

# 9. Local Ollama or OpenAI Embedding Compiler
vector_store = []
ollama_model = None

# A. Try checking local Ollama instance
try:
    req = urllib.request.Request("http://127.0.0.1:11434/api/tags")
    with urllib.request.urlopen(req, timeout=1) as res:
        tags_data = json.loads(res.read().decode("utf-8"))
        models = tags_data.get("models", [])
        if models:
            for m in models:
                if "embed" in m["name"].lower() or "nomic" in m["name"].lower():
                    ollama_model = m["name"]
                    break
            if not ollama_model:
                ollama_model = models[0]["name"]
            print(f"Ollama running. Found local model for embedding: {ollama_model}")
except Exception:
    pass

openai_key = os.environ.get("OPENAI_API_KEY")

if ollama_model:
    print(f"Generating local embeddings using Ollama ({ollama_model})...")
    for chunk in chunks:
        req_data = json.dumps({"model": ollama_model, "prompt": chunk["text"]}).encode("utf-8")
        req = urllib.request.Request(
            "http://127.0.0.1:11434/api/embeddings",
            data=req_data,
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                res_data = json.loads(res.read().decode("utf-8"))
                vector = res_data["embedding"]
                vector_store.append({
                    "id": chunk["id"],
                    "text": chunk["text"],
                    "category": chunk["category"],
                    "title": chunk["title"],
                    "vector": vector,
                    "terms": compute_tf_idf(chunk["text"])
                })
        except Exception as e:
            print(f"Error fetching Ollama embedding for {chunk['id']}: {e}")
            vector_store.append({
                "id": chunk["id"],
                "text": chunk["text"],
                "category": chunk["category"],
                "title": chunk["title"],
                "vector": None,
                "terms": compute_tf_idf(chunk["text"])
            })
    vector_type = "ollama"
    embedding_model_name = ollama_model
    
elif openai_key:
    print("OpenAI API Key detected. Fetching embeddings...")
    for chunk in chunks:
        req_data = json.dumps({"input": chunk["text"], "model": "text-embedding-3-small"}).encode("utf-8")
        req = urllib.request.Request(
            "https://api.openai.com/v1/embeddings",
            data=req_data,
            headers={"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req) as res:
                res_data = json.loads(res.read().decode("utf-8"))
                vector = res_data["data"][0]["embedding"]
                vector_store.append({
                    "id": chunk["id"],
                    "text": chunk["text"],
                    "category": chunk["category"],
                    "title": chunk["title"],
                    "vector": vector,
                    "terms": compute_tf_idf(chunk["text"])
                })
        except Exception as e:
            print(f"Error fetching OpenAI embedding for {chunk['id']}: {e}")
            vector_store.append({
                "id": chunk["id"],
                "text": chunk["text"],
                "category": chunk["category"],
                "title": chunk["title"],
                "vector": None,
                "terms": compute_tf_idf(chunk["text"])
            })
    vector_type = "openai"
    embedding_model_name = "text-embedding-3-small"
    
else:
    print("No Ollama models or OpenAI API Key. Generating local TF-IDF vector database...")
    for chunk in chunks:
        vector_store.append({
            "id": chunk["id"],
            "text": chunk["text"],
            "category": chunk["category"],
            "title": chunk["title"],
            "vector": None,
            "terms": compute_tf_idf(chunk["text"])
        })
    vector_type = "tfidf"
    embedding_model_name = "local-tfidf"

# 10. Save Master Image Manifest (public/image_manifest.json) - (Issue 4)
image_manifest = []
for p in photos_list:
    image_manifest.append({
        "src": p["src"],
        "category": p["category"],
        "display_title": p["title"],
        "display_caption": p["description"],
        "display_priority": p["display_priority"],
        "display_section": p["display_section"],
        "portrait_or_landscape": p["orientation"],
        "featured": p["featured"],
        "exclude_from_gallery": p["exclude_from_gallery"]
    })

# Add contextual visuals into the manifest for completeness
contextual_manifest = [
    {
        "src": "/images/contextual/patna-skyline.png",
        "category": "Traditional",
        "display_title": "Patna Heritage Skyline",
        "display_caption": "Golghar and modern Patna along the holy Ganges river.",
        "display_priority": 1,
        "display_section": "journey",
        "portrait_or_landscape": "landscape",
        "featured": True,
        "exclude_from_gallery": True
    },
    {
        "src": "/images/contextual/buxar-heritage.png",
        "category": "Traditional",
        "display_title": "Buxar Temple Heritage",
        "display_caption": "Tranquil temple structures representing family roots in Buxar district.",
        "display_priority": 1,
        "display_section": "journey",
        "portrait_or_landscape": "square",
        "featured": True,
        "exclude_from_gallery": True
    },
    {
        "src": "/images/contextual/coimbatore-campus.png",
        "category": "Personal",
        "display_title": "Coimbatore Engineering Campus",
        "display_caption": "Campus visual representing B.Tech IT collegiate years in Coimbatore.",
        "display_priority": 1,
        "display_section": "journey",
        "portrait_or_landscape": "landscape",
        "featured": True,
        "exclude_from_gallery": True
    },
    {
        "src": "/images/contextual/first-career-workspace.png",
        "category": "Professional",
        "display_title": "Early Career Workspace",
        "display_caption": "Software development workspace representation during early DevOps years.",
        "display_priority": 1,
        "display_section": "journey",
        "portrait_or_landscape": "landscape",
        "featured": True,
        "exclude_from_gallery": True
    },
    {
        "src": "/images/contextual/bosch-automation.png",
        "category": "Professional",
        "display_title": "Industrial Automation Rig",
        "display_caption": "Automated telemetry engineering dashboard visual at Bosch.",
        "display_priority": 1,
        "display_section": "journey",
        "portrait_or_landscape": "square",
        "featured": True,
        "exclude_from_gallery": True
    },
    {
        "src": "/images/contextual/ubs-fintech.png",
        "category": "Professional",
        "display_title": "FinTech operations command center",
        "display_caption": "Modern enterprise cloud architecture visualization at UBS.",
        "display_priority": 1,
        "display_section": "journey",
        "portrait_or_landscape": "landscape",
        "featured": True,
        "exclude_from_gallery": True
    },
    {
        "src": "/images/contextual/future-ai-roadmap.png",
        "category": "Personal",
        "display_title": "GenAI & Computing Infrastructure",
        "display_caption": "Abstract roadmap visualization of AI leadership and cloud growth.",
        "display_priority": 1,
        "display_section": "journey",
        "portrait_or_landscape": "square",
        "featured": True,
        "exclude_from_gallery": True
    }
]

full_manifest = image_manifest + contextual_manifest

with open(os.path.join(PUBLIC_DIR, "image_manifest.json"), "w", encoding="utf-8") as f:
    json.dump(full_manifest, f, indent=2)

with open(os.path.join(PUBLIC_DIR, "profile_knowledge.json"), "w", encoding="utf-8") as f:
    json.dump(profile_data, f, indent=2)

with open(os.path.join(PUBLIC_DIR, "knowledge_chunks.json"), "w", encoding="utf-8") as f:
    json.dump(chunks, f, indent=2)

with open(os.path.join(PUBLIC_DIR, "vector_store.json"), "w", encoding="utf-8") as f:
    json.dump({
        "type": vector_type, 
        "model": embedding_model_name,
        "data": vector_store
    }, f, indent=2)

# Generate knowledge.md
markdown_content = f"""# Atul Choubey Profile Knowledge Base

## Personal Information
- **Name**: {profile_data['personal']['name']}
- **Date of Birth**: {profile_data['personal']['birth_display']}
- **Birth Place**: {profile_data['personal']['birth_place']}
- **Age**: {profile_data['personal']['age']} years old
- **Height**: {profile_data['personal']['height']}
- **Gothra**: {profile_data['personal']['gothra']}
- **Zodiac (Rashi)**: {profile_data['personal']['rashi']}
- **Native Place**: {profile_data['personal']['native_place']}
- **Current Location**: {profile_data['personal']['current_city']}
- **Email**: {profile_data['personal']['email']}
- **LinkedIn**: {profile_data['personal']['linkedin']}

## Education
- **Degree**: {profile_data['education']['ug']['degree']} in {profile_data['education']['ug']['specialization']}
- **College**: {profile_data['education']['ug']['institute']} ({profile_data['education']['ug']['university']})
- **Classification**: {profile_data['education']['ug']['classification']} (Graduated {profile_data['education']['ug']['passing_year']})
- **Schooling**: {profile_data['education']['hsc']['school']} (10th in 2013 with {profile_data['education']['sslc']['cgpa']} CGPA, 12th in 2015)

## Career History
1. **Senior MLOps / ML Platform Engineer** at Accenture (Client: UBS) — 2025 - Present
2. **Senior Software Engineer – DevOps** at Bosch Global Software Technology — 2023 - 2024
3. **DevOps & Platform Engineer** at Kalycito Infotech — 2020 - 2022

## Family
- **Father**: {profile_data['family']['father']['name']} ({profile_data['family']['father']['occupation']})
- **Mother**: {profile_data['family']['mother']['name']} ({profile_data['family']['mother']['occupation']})
- **Brother**: {profile_data['family']['brother']['name']} ({profile_data['family']['brother']['occupation']})
- **Grandfather**: {profile_data['family']['grandfather']['name']} ({profile_data['family']['grandfather']['occupation']})
- **Origins**: {profile_data['family']['roots']['village']}, {profile_data['family']['roots']['district']}, {profile_data['family']['roots']['state']}

## Marriage Preferences
- **Expectations**: {profile_data['marriage_preferences']['expectations']}
"""
with open(os.path.join(PUBLIC_DIR, "knowledge.md"), "w", encoding="utf-8") as f:
    f.write(markdown_content)

# 11. Generate src/data/profile.ts
ts_content = f"""// Auto-generated profile data from build_knowledge.py. DO NOT EDIT DIRECTLY.

export const profileData = {json.dumps(profile_data, indent=2)};

export const imageManifest = {json.dumps(full_manifest, indent=2)};

export const resumeText = `{resume_text.replace('`', '\\`').replace('$', '\\$')}`;
"""
with open(os.path.join(SRC_DATA_DIR, "profile.ts"), "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Master Memory Graph & Knowledge Base compiled successfully!")
print(f"Generated public/image_manifest.json, public/profile_knowledge.json and src/data/profile.ts")
