import type { Metadata } from "next";
import TwinAvatar from "@/components/TwinAvatar";
import TalkToTwinButton from "@/components/TalkToTwinButton";

export const metadata: Metadata = {
  title: "Kenel Belizaire — Digital Twin",
  description: "Network & Security Engineer — interactive 3D profile",
};

const SKILLS: { category: string; items: string[] }[] = [
  {
    category: "Network Security",
    items: [
      "Firewall administration (Cisco ASA, Firepower Threat Defense)",
      "VPN (IPsec, SSL)",
      "Network segmentation",
      "Port security & ACLs",
      "Cisco Identity Services Engine (ISE)",
    ],
  },
  {
    category: "Security Operations",
    items: [
      "SIEM",
      "Syslog & SNMP",
      "Log analysis",
      "Vulnerability assessment",
      "Incident response",
      "Risk analysis",
    ],
  },
  {
    category: "Routing & Switching",
    items: ["EIGRP", "OSPF / OSPFv3", "BGP", "VLAN & trunking", "Spanning Tree Protocol", "EtherChannel"],
  },
  {
    category: "Protocols & Networking",
    items: ["TCP/IP & OSI model", "IP addressing & subnetting", "DNS / DHCP / ARP / ICMP"],
  },
  {
    category: "Systems & Cloud",
    items: ["Windows Server & Active Directory", "Linux / UNIX", "Cloud security", "Virtualization"],
  },
  {
    category: "Compliance & Documentation",
    items: ["PCI-DSS", "GLBA", "Network documentation", "Runbooks & policy development"],
  },
];

const CERTIFICATIONS = [
  "CompTIA SecurityX (formerly CASP+)",
  "CompTIA Security Analytics Expert (CSAE)",
  "CompTIA Cybersecurity Analyst (CySA+)",
  "CompTIA Security+",
  "Cisco Certified Network Associate (CCNA)",
  "CCNP Security — in progress, expected June 2027",
  "Cisco AI Solutions on Cisco Infrastructure Essentials (DCAIE)",
  "Microsoft Certified Professional (MCP)",
];

const EXPERIENCE = [
  {
    role: "Information Technology Support Consultant",
    org: "Desir Financial Group, Pompano Beach, FL",
    dates: "Mar 2020 – Jan 2026",
    highlights: [
      "Designed and implemented secure LAN, WAN, and firewall architectures, reducing unplanned downtime 25% and increasing operational productivity 20%.",
      "Maintained a 95% first-contact resolution rate on network, VPN, and endpoint security escalations.",
      "Deployed centralized syslog and SNMP monitoring integrated with SIEM, improving threat detection.",
    ],
  },
  {
    role: "Nurse Call System Technician",
    org: "BESCO, Delray Beach, FL",
    dates: "Sep 2016 – Mar 2018",
    highlights: [
      "Installed, commissioned, and maintained nurse call, intercom, and patient monitoring systems in active healthcare facilities.",
    ],
  },
  {
    role: "Network Technician",
    org: "TCE Technologies, Miami, FL",
    dates: "Dec 2011 – Dec 2015",
    highlights: [
      "Installed, terminated, and certified Cat5e/Cat6 copper and fiber optic cabling to structured cabling standards.",
      "Configured network switches, wireless access points, and security parameters for client deployments.",
    ],
  },
  {
    role: "Network Administrator",
    org: "EDH, Port-au-Prince, Haiti",
    dates: "Dec 2000 – Dec 2011",
    highlights: [
      "Directed technical management and lifecycle planning of corporate LAN/WAN infrastructure.",
      "Administered a mixed-platform server environment spanning UNIX, Linux, and Windows Server.",
    ],
  },
];

const EDUCATION = [
  {
    degree: "B.S. Computer Science",
    org: "European-American University, Paris, France",
    dates: "",
  },
  {
    degree: "A.S. Network Administration",
    org: "ATI Career Training Center, Fort Lauderdale, United States of America",
    dates: "",
  },
  {
    degree: "CCNP Security Program",
    org: "PM Networking Institute",
    dates: "Aug 2025 – Present",
  },
];

const CONTINUING_EDUCATION = [
  {
    title: "AI Builder",
    description: "Create Agents, Voice Agents & Automations in n8n",
  },
  {
    title: "AI Coder",
    description: "Complete Claude Code & Coding Agents",
  },
  {
    title: "AI Leader",
    description: "Generative AI & Agentic AI for Leaders & Founders",
  },
  {
    title: "AI Engineer Core Track",
    description: "LLM Engineering, RAG, QLoRA, Agents",
  },
  {
    title: "AI Engineer Agentic Track",
    description: "The Complete Agent & MCP",
  },
  {
    title: "AI Engineer Production Track",
    description: "Deploy LLMs & Agents at Scale",
  },
  {
    title: "Build LLM Apps & AI-Agents with n8n & APIs",
    description: "",
  },
  {
    title: "The Complete AI Agents and AI Automations",
    description: "",
  },
];

const PROJECTS = [
  {
    title: "AI Digital Twin",
    description:
      "An AI-powered digital twin — an interactive 3D profile and chatbot that answers questions about my career, background, and skills.",
    url: "https://twin-eta.vercel.app/twin",
  },
  {
    title: "BuildIQ",
    description:
      "An AI-powered project estimator for contractors, with instant estimates across electrical, plumbing, HVAC, roofing, and other trades.",
    url: "https://build-iq-ten.vercel.app/",
  },
];

export default function TwinProfilePage() {
  return (
    <main className="twin-page">
      <nav className="twin-nav">
        <span className="twin-nav-brand">Kenel Belizaire</span>
        <div className="twin-nav-links">
          <TalkToTwinButton className="twin-nav-link">Digital Twin</TalkToTwinButton>
          <a href="#projects" className="twin-nav-link">
            Projects
          </a>
          <a href="#about" className="twin-nav-link">
            About
          </a>
          <a href="#contact" className="twin-nav-link">
            Contact
          </a>
        </div>
      </nav>

      <section id="about" className="hero">
        <div className="hero-text">
          <p className="eyebrow">Digital Twin — Interactive Profile</p>
          <h1>Kenel Belizaire</h1>
          <p className="role">Entrepreneur · AI, Network &amp; Security Engineer</p>
          <p className="hero-body">
            Over 20 years designing, implementing, and securing enterprise LAN and WAN
            infrastructure across financial services, healthcare, and utility environments.
            Originally from Port-au-Prince, Haiti, based in Florida since 2010.
          </p>
          <div className="hero-actions">
            <TalkToTwinButton className="btn-primary">Talk to my AI twin</TalkToTwinButton>
            <a href="mailto:kenelb01@gmail.com" className="btn-secondary">
              Email me
            </a>
            <a
              href="https://www.linkedin.com/in/kenelb/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        <div className="avatar-frame">
          <TwinAvatar />
          <p className="avatar-caption">Drag to rotate · Scroll to zoom</p>
        </div>
      </section>

      <section className="section">
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          {SKILLS.map((group) => (
            <div key={group.category} className="skill-card">
              <h3>{group.category}</h3>
              <div className="tag-list">
                {group.items.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Certifications</h2>
          <a
            href="https://www.credly.com/users/kenel-belizaire/badges/credly"
            target="_blank"
            rel="noopener noreferrer"
            className="credly-link"
          >
            View verified badges on Credly ↗
          </a>
        </div>
        <div className="tag-list">
          {CERTIFICATIONS.map((cert) => (
            <span key={cert} className="tag tag-cert">
              {cert}
            </span>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <h2>Projects</h2>
        <div className="card-grid">
          {PROJECTS.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="info-card project-card"
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="project-link">View project ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Experience</h2>
        <div className="timeline">
          {EXPERIENCE.map((job) => (
            <div key={job.role + job.org} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h3>{job.role}</h3>
                <p className="timeline-meta">
                  {job.org} · {job.dates}
                </p>
                <ul>
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Education</h2>
        <div className="card-grid">
          {EDUCATION.map((ed) => (
            <div key={ed.degree} className="info-card">
              <h3>{ed.degree}</h3>
              <p>{ed.dates ? `${ed.org} · ${ed.dates}` : ed.org}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Continuing Education</h2>
        <div className="card-grid">
          {CONTINUING_EDUCATION.map((course) => (
            <div key={course.title} className="info-card">
              <h3>{course.title}</h3>
              {course.description && <p>{course.description}</p>}
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className="twin-footer">
        <h2>Contact</h2>
        <p>Want to know more? Ask my AI twin directly.</p>
        <div className="hero-actions twin-footer-actions">
          <TalkToTwinButton className="btn-primary">Open the chat →</TalkToTwinButton>
        </div>
      </footer>
    </main>
  );
}
