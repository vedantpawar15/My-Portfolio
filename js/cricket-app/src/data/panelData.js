export const PANEL_IDS = ['about', 'skills', 'projects', 'contact'];

export const panelData = {
  about: {
    label: 'Player profile',
    title: "Hey, I'm\nVedant",
    html: `
      <p class="panel-body">Electrical &amp; Computer Engineering at MIT-WPU. I like systems that sit between hardware and software — control, sensors, integration — and I carry the same focus into code.</p>
      <p class="panel-body">MIT Tech Team (Robocon) taught me deadlines, teamwork, and debugging under pressure. Cricket taught me patience and going for the boundary when the ball's there to hit.</p>
      <div class="pill-row">
        <span class="pill">C / C++</span>
        <span class="pill">Embedded</span>
        <span class="pill">Web</span>
        <span class="pill">Python</span>
        <span class="pill">Git</span>
        <span class="pill">Robocon</span>
      </div>`,
  },
  skills: {
    label: 'Scorecard',
    title: 'Tech stack',
    html: `
      <div class="skill-item"><div class="skill-header"><span class="skill-name">C</span><span class="skill-val">85%</span></div><div class="skill-track"><div class="skill-fill" data-w="85"></div></div></div>
      <div class="skill-item"><div class="skill-header"><span class="skill-name">C++</span><span class="skill-val">85%</span></div><div class="skill-track"><div class="skill-fill" data-w="85"></div></div></div>
      <div class="skill-item"><div class="skill-header"><span class="skill-name">HTML / CSS / JS</span><span class="skill-val">85%</span></div><div class="skill-track"><div class="skill-fill" data-w="85"></div></div></div>
      <div class="skill-item"><div class="skill-header"><span class="skill-name">Python</span><span class="skill-val">75%</span></div><div class="skill-track"><div class="skill-fill" data-w="75"></div></div></div>
      <div class="skill-item"><div class="skill-header"><span class="skill-name">Git &amp; GitHub</span><span class="skill-val">80%</span></div><div class="skill-track"><div class="skill-fill" data-w="80"></div></div></div>
      <div class="skill-item"><div class="skill-header"><span class="skill-name">SQL / MongoDB</span><span class="skill-val">60%</span></div><div class="skill-track"><div class="skill-fill" data-w="60"></div></div></div>`,
  },
  projects: {
    label: 'Powerplay',
    title: 'Featured work',
    html: `
      <div class="project-item">
        <div class="project-item-title">Robocon · MIT Tech Team</div>
        <div class="project-item-desc">Control systems, sensors, and integration on a competitive robotics timeline.</div>
        <div class="project-item-stack"><span class="pill">C++</span><span class="pill">Hardware</span><span class="pill">Systems</span></div>
      </div>
      <div class="project-item">
        <div class="project-item-title">This 3D portfolio</div>
        <div class="project-item-desc">React Three Fiber, orbit exploration, raycast panels, and a bowl-at-stumps moment.</div>
        <div class="project-item-stack"><span class="pill">React</span><span class="pill">R3F</span><span class="pill">Three.js</span></div>
      </div>
      <div class="project-item">
        <div class="project-item-title">Core &amp; web labs</div>
        <div class="project-item-desc">Coursework and side experiments in C, embedded-style thinking, and modern front-end.</div>
        <div class="project-item-stack"><span class="pill">C</span><span class="pill">JS</span><span class="pill">Learning</span></div>
      </div>`,
  },
  contact: {
    label: 'End of innings',
    title: "Let's talk",
    html: `
      <p class="panel-body">Open to internships, tech roles, and collaborations. Prefer email; LinkedIn works too.</p>
      <a class="email-btn" href="mailto:vedant.15_mtt@gmail.com">vedant.15_mtt@gmail.com</a>
      <p class="panel-body muted">Pune, Maharashtra</p>
      <div class="social-row">
        <a href="https://github.com/vedantpawar15" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/vedantpawar15/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume PDF</a>
      </div>`,
  },
};
