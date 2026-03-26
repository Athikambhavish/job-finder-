CREATE DATABASE IF NOT EXISTS jobfinder;
USE jobfinder;

CREATE TABLE IF NOT EXISTS users (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(120) NOT NULL,
    email            VARCHAR(180) NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    location         VARCHAR(120),
    bio              TEXT,
    resume_url       VARCHAR(500),
    skills           VARCHAR(500),
    experience_level VARCHAR(60),
    desired_salary   VARCHAR(80),
    preferred_remote BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    logo VARCHAR(10),
    color VARCHAR(10),
    website VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company_id BIGINT NOT NULL,
    location VARCHAR(150) NOT NULL,
    type ENUM('FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP') NOT NULL DEFAULT 'FULL_TIME',
    salary_min INT, salary_max INT, salary_label VARCHAR(80),
    remote BOOLEAN DEFAULT FALSE,
    description TEXT, tags VARCHAR(500), url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    applicant_name VARCHAR(120),
    applicant_email VARCHAR(180),
    cover_note TEXT,
    status ENUM('APPLIED','REVIEWED','INTERVIEW','OFFER','REJECTED') DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_job (user_id, job_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_saved (user_id, job_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

INSERT INTO companies (name,logo,color,website,description) VALUES
('Stripe','S','#635BFF','https://stripe.com','Financial infrastructure for the internet'),
('Figma','F','#F24E1E','https://figma.com','Collaborative design platform'),
('Anthropic','A','#CC785C','https://anthropic.com','AI safety company'),
('Vercel','V','#000000','https://vercel.com','Frontend cloud platform'),
('GitHub','G','#238636','https://github.com','Developer collaboration platform'),
('Linear','L','#5E6AD2','https://linear.app','Issue tracking for software teams'),
('Spotify','S','#1DB954','https://spotify.com','Music streaming platform'),
('Cloudflare','C','#F38020','https://cloudflare.com','Network security and performance'),
('Notion','N','#000000','https://notion.so','All-in-one workspace'),
('Coinbase','C','#0052FF','https://coinbase.com','Cryptocurrency exchange'),
('Shopify','S','#96BF48','https://shopify.com','Commerce platform'),
('Airbnb','A','#FF5A5F','https://airbnb.com','Online marketplace for lodging'),
('Netflix','N','#E50914','https://netflix.com','Streaming entertainment service'),
('Slack','S','#4A154B','https://slack.com','Business communication platform'),
('Datadog','D','#632CA6','https://datadoghq.com','Monitoring and analytics platform'),
('HashiCorp','H','#7B42BC','https://hashicorp.com','Infrastructure automation'),
('Twilio','T','#F22F46','https://twilio.com','Cloud communications platform'),
('MongoDB','M','#47A248','https://mongodb.com','NoSQL database company'),
('Elastic','E','#FEC514','https://elastic.co','Search and observability'),
('Atlassian','A','#0052CC','https://atlassian.com','Team collaboration software');

INSERT INTO jobs (title,company_id,location,type,salary_min,salary_max,salary_label,remote,description,tags,url,posted_at) VALUES
('Senior Frontend Engineer',1,'San Francisco, CA','FULL_TIME',140000,180000,'$140k-$180k',TRUE,'Build next-gen payment interfaces used by millions worldwide.','React,TypeScript,GraphQL','https://stripe.com/jobs',NOW()-INTERVAL 2 DAY),
('Backend Engineer – Payments',1,'New York, NY','FULL_TIME',150000,200000,'$150k-$200k',TRUE,'Design and build the core payments API serving billions of transactions.','Java,Scala,Kafka','https://stripe.com/jobs',NOW()-INTERVAL 4 DAY),
('Product Designer',2,'New York, NY','FULL_TIME',120000,160000,'$120k-$160k',TRUE,'Shape the future of design tools for millions of creators.','UI/UX,Prototyping,Figma','https://figma.com/jobs',NOW()-INTERVAL 1 DAY),
('Design Systems Engineer',2,'San Francisco, CA','FULL_TIME',130000,170000,'$130k-$170k',TRUE,'Build and maintain Figmas design system used across the entire product.','React,TypeScript,CSS','https://figma.com/jobs',NOW()-INTERVAL 5 DAY),
('ML Engineer',3,'San Francisco, CA','FULL_TIME',160000,220000,'$160k-$220k',TRUE,'Work on frontier AI systems and help build safe beneficial AI.','Python,PyTorch,LLMs','https://anthropic.com/jobs',NOW()-INTERVAL 3 DAY),
('Research Engineer RLHF',3,'San Francisco, CA','FULL_TIME',170000,240000,'$170k-$240k',FALSE,'Drive research on reinforcement learning from human feedback.','Python,ML,Research','https://anthropic.com/jobs',NOW()-INTERVAL 6 DAY),
('Backend Engineer',4,'Remote','FULL_TIME',130000,170000,'$130k-$170k',TRUE,'Architect the infrastructure powering the modern web at massive scale.','Node.js,Rust,Edge','https://vercel.com/jobs',NOW()-INTERVAL 5 DAY),
('Developer Advocate',4,'Remote','FULL_TIME',110000,140000,'$110k-$140k',TRUE,'Help developers get the most out of Vercel through talks docs and demos.','React,Next.js,Writing','https://vercel.com/jobs',NOW()-INTERVAL 8 DAY),
('DevOps Engineer',5,'Seattle, WA','FULL_TIME',125000,165000,'$125k-$165k',FALSE,'Keep GitHub running for 100M+ developers worldwide.','Kubernetes,AWS,CI/CD','https://github.com/jobs',NOW()-INTERVAL 7 DAY),
('Security Engineer',5,'Remote','FULL_TIME',140000,180000,'$140k-$180k',TRUE,'Protect GitHubs platform and 100M developer accounts from threats.','Security,Go,Networking','https://github.com/jobs',NOW()-INTERVAL 10 DAY),
('iOS Developer',6,'Remote','FULL_TIME',110000,150000,'$110k-$150k',TRUE,'Craft a world-class issue tracking experience on iOS.','Swift,SwiftUI,Xcode','https://linear.app/jobs',NOW()-INTERVAL 4 DAY),
('Android Developer',6,'Remote','FULL_TIME',110000,150000,'$110k-$150k',TRUE,'Build Linears Android app used by engineering teams globally.','Kotlin,Jetpack Compose,Android','https://linear.app/jobs',NOW()-INTERVAL 9 DAY),
('Data Scientist',7,'Stockholm, SE','FULL_TIME',95000,130000,'$95k-$130k',FALSE,'Use data to understand how 500M listeners discover music.','Python,Spark,SQL','https://spotify.com/jobs',NOW()-INTERVAL 6 DAY),
('ML Engineer Recommendations',7,'Remote','FULL_TIME',120000,160000,'$120k-$160k',TRUE,'Improve Spotifys recommendation engine powering Discover Weekly.','Python,TensorFlow,MLOps','https://spotify.com/jobs',NOW()-INTERVAL 11 DAY),
('Network Engineer',8,'Austin, TX','FULL_TIME',135000,175000,'$135k-$175k',TRUE,'Protect internet infrastructure across DDoS zero-trust and WAF.','Security,Networking,Rust','https://cloudflare.com/jobs',NOW()-INTERVAL 2 DAY),
('Rust Engineer',8,'Remote','FULL_TIME',140000,185000,'$140k-$185k',TRUE,'Build high-performance network services processing millions of req/s.','Rust,C++,Networking','https://cloudflare.com/jobs',NOW()-INTERVAL 3 DAY),
('Growth Product Manager',9,'San Francisco, CA','FULL_TIME',140000,185000,'$140k-$185k',FALSE,'Drive user acquisition and retention for one of the fastest-growing tools.','Product,Growth,Analytics','https://notion.so/jobs',NOW()-INTERVAL 3 DAY),
('Full Stack Engineer',9,'New York, NY','FULL_TIME',130000,170000,'$130k-$170k',TRUE,'Build features for Notions 30M+ users across web and desktop.','React,Node.js,TypeScript','https://notion.so/jobs',NOW()-INTERVAL 7 DAY),
('React Native Developer',10,'Remote','CONTRACT',90000,120000,'$90-$120/hr',TRUE,'Build mobile experience for the most trusted crypto exchange.','React Native,TypeScript,Web3','https://coinbase.com/jobs',NOW()-INTERVAL 1 DAY),
('Blockchain Engineer',10,'San Francisco, CA','FULL_TIME',160000,220000,'$160k-$220k',TRUE,'Develop and audit smart contracts for Coinbases DeFi products.','Solidity,Ethereum,Go','https://coinbase.com/jobs',NOW()-INTERVAL 5 DAY),
('Staff Engineer',11,'Toronto, CA','FULL_TIME',175000,230000,'$175k-$230k',TRUE,'Lead architecture across Shopifys commerce platform for 2M merchants.','Ruby,Rails,Architecture','https://shopify.com/jobs',NOW()-INTERVAL 14 DAY),
('Frontend Engineer',11,'Remote','FULL_TIME',120000,160000,'$120k-$160k',TRUE,'Build storefront components used by millions of merchants worldwide.','React,TypeScript,GraphQL','https://shopify.com/jobs',NOW()-INTERVAL 4 DAY),
('Senior UX Researcher',12,'San Francisco, CA','FULL_TIME',130000,170000,'$130k-$170k',FALSE,'Conduct user research to improve Airbnbs experience for guests and hosts.','UX Research,Figma,Data Analysis','https://airbnb.com/jobs',NOW()-INTERVAL 3 DAY),
('Data Engineer',12,'Remote','FULL_TIME',125000,165000,'$125k-$165k',TRUE,'Build data pipelines powering Airbnbs pricing and recommendation systems.','Python,Spark,Airflow','https://airbnb.com/jobs',NOW()-INTERVAL 8 DAY),
('Senior Software Engineer',13,'Los Angeles, CA','FULL_TIME',170000,230000,'$170k-$230k',FALSE,'Build streaming infrastructure delivering content to 230M subscribers.','Java,AWS,Microservices','https://netflix.com/jobs',NOW()-INTERVAL 2 DAY),
('Platform Engineer',14,'San Francisco, CA','FULL_TIME',145000,190000,'$145k-$190k',TRUE,'Build Slacks platform APIs used by thousands of third-party app developers.','Node.js,Go,Kubernetes','https://slack.com/jobs',NOW()-INTERVAL 1 DAY),
('Technical Writer',14,'Remote','FULL_TIME',90000,120000,'$90k-$120k',TRUE,'Write world-class documentation for Slacks developer platform.','Writing,APIs,Markdown','https://slack.com/jobs',NOW()-INTERVAL 9 DAY),
('Site Reliability Engineer',15,'New York, NY','FULL_TIME',145000,190000,'$145k-$190k',TRUE,'Ensure reliability for Datadogs monitoring platform at massive scale.','Go,Kubernetes,Prometheus','https://datadoghq.com/jobs',NOW()-INTERVAL 2 DAY),
('Developer Experience Engineer',17,'Remote','FULL_TIME',120000,160000,'$120k-$160k',TRUE,'Build SDKs and tools making it easy for developers to use Twilio APIs.','Python,Node.js,SDKs','https://twilio.com/jobs',NOW()-INTERVAL 4 DAY),
('Database Engineer',18,'Remote','FULL_TIME',130000,175000,'$130k-$175k',TRUE,'Work on MongoDBs core database engine and distributed systems.','C++,Go,Distributed Systems','https://mongodb.com/jobs',NOW()-INTERVAL 6 DAY),
('Product Manager Jira',20,'Remote','FULL_TIME',140000,180000,'$140k-$180k',TRUE,'Define and ship the roadmap for Jira used by 65000+ companies.','Product,Roadmap,B2B','https://atlassian.com/jobs',NOW()-INTERVAL 3 DAY);
