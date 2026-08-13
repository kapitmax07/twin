import type { Metadata } from "next";
import Link from "next/link";
import TwinAvatar from "@/components/TwinAvatar";

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
    org: "European-American University",
    dates: "Feb 2026",
  },
  {
    degree: "A.S. Network Administration",
    org: "ATI Career Training Center, Fort Lauderdale, FL",
    dates: "2011 · Honors, 3.9 GPA",
  },
  {
    degree: "CCNP Security Program",
    org: "PM Networking Institute",
    dates: "Aug 2025 – Present",
  },
];

export default function TwinProfilePage() {
  return (
    <main className="twin-page">
      <nav className="twin-nav">
        <span className="twin-nav-brand">Kenel Belizaire</span>
        <Link href="/" className="twin-nav-link">
          Chat with my AI twin →
        </Link>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Digital Twin — Interactive Profile</p>
          <h1>Kenel Belizaire</h1>
          <p className="role">Entrepreneur · AI, Network &amp; Security Engineer</p>
          <p className="hero-body">
            Over 20 years designing, implementing, and securing enterprise LAN and WAN
            infrastructure across financial services, healthcare, and utility environments.
            Originally from Port-de-Paix, Haiti, based in Florida since 2010.
          </p>
          <div className="hero-actions">
            <Link href="/" className="btn-primary">
              Talk to my AI twin
            </Link>
            <a href="mailto:kenelb01@gmail.com" className="btn-secondary">
              Email me
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
        <h2>Certifications</h2>
        <div className="tag-list">
          {CERTIFICATIONS.map((cert) => (
            <span key={cert} className="tag tag-cert">
              {cert}
            </span>
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
        <div className="timeline">
          {EDUCATION.map((ed) => (
            <div key={ed.degree} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h3>{ed.degree}</h3>
                <p className="timeline-meta">
                  {ed.org} · {ed.dates}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="twin-footer">
        <p>Want to know more? Ask my AI twin directly.</p>
        <Link href="/" className="btn-primary">
          Open the chat →
        </Link>
      </footer>
    </main>
  );
}
