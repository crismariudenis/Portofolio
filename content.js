// Everything shown on the site lives in this file. Edit it, reload, done.
//
// Links:     { label: "Demo", url: "https://..." }   A link with an empty url is not shown.
// Sections:  add an object to `sections` and it gets its own block and a nav entry.
// Items can use any of: title, subtitle, meta, text, media, bullets, tags, links, children.
//            layout: "side" puts the media beside the text, for smaller projects.
// Media:     put files in assets/media/<project>, then add entries like
//            { src: "assets/media/demo/clip.mp4", poster: "assets/media/demo/clip.jpg", alt: "What it shows", caption: "Optional" }
//            .mp4 and .webm play as muted clips, anything else is shown as an image.
//            { fade: [{ src, label, alt }, { src, label, alt }], caption } fades endlessly between two same-sized images.

window.PORTFOLIO = {
  profile: {
    name: "Denis Crismariu",
    photo: "assets/img/photo.jpg",
    photoAlt: "Denis Crismariu at a robotics event",
    location: "Eindhoven, Netherlands",
    headline: "Data Science and AI master's student at TU/e, working on neuroevolution and safe reinforcement learning.",
    summary:
      "My background is in Computer Science and competitive robotics. For my bachelor's thesis, graded 10/10, I wrote a neuroevolution system from scratch in C++, where teams of agents co-evolve in a 3v3 arena. They learned to shoot and dodge, then settled into a standoff that no reward tuning could break; only changing the game's rules made a real difference. The network shown here is one it evolved.",
    focus: ["Reinforcement learning", "Neuroevolution", "Multi-agent systems", "Robotics"],
    links: [
      { label: "GitHub", url: "https://github.com/crismariudenis" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/crismariu-denis-347778223/" },
      { label: "Email", url: "mailto:deniscrismariu@gmail.com" },
      { label: "CV", url: "assets/cv.pdf" },
    ],
  },

  sections: [
    {
      id: "research",
      label: "Research & AI",
      items: [
        {
          title: "The Use of the NEAT Algorithm in Cooperative and Competitive Shooter Games",
          subtitle: "Bachelor's thesis, graded 10/10",
          text: "A neuroevolution system built from scratch: a custom NEAT library, a 3v3 shooter arena in raylib and a co-evolutionary training framework.",
          bullets: [
            "Main finding: changing the game's rules (King-of-the-Hill with respawn) changed behavior far more than refining the optimizer or the reward.",
            "Added safeguards against topological collapse: an output-disconnection guard, asymmetric enable/disable mutation and output-bias clamping.",
            "Agents used the pre-wired team memory immediately, but the final networks evolved no recurrent connections for memory of their own.",
            "Training used role-separated populations, a dominance tournament with binomial significance tests, Hall-of-Fame sampling and curriculum phases.",
            "Documented what did not work: reward shaping, spawn curriculum, novelty search and memory scaling.",
          ],
          media: [
            {
              src: "assets/media/thesis/arena.mp4",
              poster: "assets/media/thesis/arena.jpg",
              alt: "Two teams of three evolved agents moving, shooting and respawning around a central point until the red team captures it",
              caption: "One full round, ending in a capture. Most self-play matches ended without one.",
            },
            {
              fade: [
                {
                  src: "assets/media/thesis/agent-view.jpg",
                  label: "Agent view",
                  alt: "One paused moment on a black field, showing only what an agent perceives: sensor rays, nearby agents and a faded remembered enemy",
                },
                {
                  src: "assets/media/thesis/real-view.jpg",
                  label: "Real arena",
                  alt: "The same moment in the full arena, with all six agents, the walls and every sensor cone",
                },
              ],
              caption: "The same moment as an agent perceives it and as it really is: enemy 2 is only a stale memory.",
            },
          ],
          tags: ["C++", "raylib", "NEAT", "Multi-agent"],
          links: [
            { label: "Code", url: "https://github.com/crismariudenis/NEAT-Thesis" },
            // { label: "Thesis PDF", url: "" },
            // { label: "Demo video", url: "" },
          ],
        },
        {
          title: "Bullet Time: Safe RL for Whole-Body Evasion on a Constrained Base",
          subtitle: "TU/e course research project with Jinyu Zhou, Harsh Salkar, Ratanjot Singh and Tugan Basaran",
          meta: "2026",
          text: "A humanoid on a small platform has to dodge flying hazards using only whole-body motion, without falling. We built two new environments on the CRAX safe-RL benchmark and trained agents with constrained RL.",
          media: [
            {
              src: "assets/media/bullet-time/plane-direct.mp4",
              poster: "assets/media/bullet-time/plane-direct.jpg",
              alt: "A simulated humanoid crouching and ducking as tilted planes pass over a round platform, with its cost staying low",
              caption: "Direct training: crouches and ducks under the planes.",
            },
            {
              src: "assets/media/bullet-time/plane-curriculum.mp4",
              poster: "assets/media/bullet-time/plane-curriculum.jpg",
              alt: "The same humanoid standing upright as planes pass through it, with its cost climbing",
              caption: "Curriculum: stands tall and accepts the hits.",
            },
            {
              explainer: [
                {
                  title: "Why reward and cost fight",
                  text: "The reward pays the robot for standing tall and straight, and the cost charges it when a plane hits. Standing tall keeps it in the planes' path, so it has to give something up. The cost budget (5 per episode) sets how much hitting it may accept. Ideally it stands tall and ducks only while a plane passes.",
                },
                {
                  title: "Reading the charts",
                  text: "There is no time axis. Each dot is one evaluation during training, and the line is the agent's path, ending at the large dot. Evaluations with over 20% falls are left out. The dotted line is the curriculum's switch from level 2 to level 3. Results are from one run per agent.",
                },
              ],
            },
            {
              chart: "plane-tradeoff",
              caption: "Crouching cuts the cost but gives up height reward. Standing tall keeps the reward but takes hits.",
            },
            {
              chart: "plane-posture",
              caption: "Direct tilts first, then crouches. Curriculum stays straight.",
            },
          ],
          bullets: [
            "My part: the plane environment, adapted from an existing CRAX environment.",
            "Main finding on the plane task: training directly on the final level beat a three-level curriculum. One level's cost budget was out of reach, which taught the agent to accept hits.",
          ],
          tags: ["Python", "JAX", "MuJoCo XLA", "PPO-Lagrangian", "Constrained MDPs", "Humanoids"],
          links: [
            { label: "Project website", url: "https://sratanjot1.github.io/Research-Topics-/" },
            { label: "My fork", url: "https://github.com/crismariudenis/CRAX-Denis-Fork" },
            { label: "CRAX", url: "https://github.com/TTomilin/CRAX" },
            { label: "Paper", url: "assets/media/bullet-time/paper.pdf" },
          ],
        },
        {
          title: "NeuralNetworkCPP",
          subtitle: "Neural network library in C++",
          meta: "July 2023 – November 2024",
          text: "A small plug-and-play API with backpropagation, SGD with momentum, learning rate decay and HogBatching, a lock-free parallel mini-batch update based on Hogwild. Demos include MNIST upscaling, digit transitions and digit compression, plus adder and XOR.",
          media: [{
            src: "assets/media/neuralnetworkcpp/transition.mp4",
            poster: "assets/media/neuralnetworkcpp/transition.jpg",
            alt: "The cost curve, network weights and generated MNIST digits as a network blends one digit into another",
          }],
          tags: ["C++", "raylib", "stb", "MNIST"],
          links: [{ label: "Code", url: "https://github.com/crismariudenis/NeuralNetworkCpp" }],
        },
        {
          title: "DotsAi",
          subtitle: "My first neuroevolution project",
          layout: "side",
          text: "A genetic algorithm evolves small fixed-shape neural networks (4-8-4) that steer dots around a moving goal, the idea I later took further with NEAT.",
          bullets: [
            "Dots score for staying near the goal and die if they hit a wall, with circling the goal as the target behavior.",
            "The only inputs are a dot's position relative to the goal, now and one step ahead.",
            "Neural network and matrix classes written by hand in Java.",
          ],
          media: [{
            src: "assets/media/dotsai/training.mp4",
            poster: "assets/media/dotsai/training.jpg",
            alt: "A population of dots chasing a moving goal, with the network and best fitness shown on screen",
          }],
          tags: ["Java"],
          links: [{ label: "Code", url: "https://github.com/crismariudenis/DotsAi" }],
        },
      ],
    },
    {
      id: "robotics",
      label: "Robotics",
      intro: "Hands-on since 2021, from competition robots and legged control to learned whole-body control in simulation with Bullet Time.",
      items: [
        {
          title: "CyLiis",
          subtitle: "Technical Team Leader and Mentor, FIRST Tech Challenge robotics team",
          meta: "September 2021 – Present",
          text: "Led the Programming and 3D Design departments and organized training in programming and CAD. Also worked on building and modeling the robots.",
          bullets: [
            "Winner of the Maryland Tech Invitational 2024, Semi-Finalist in 2023.",
            "3rd Place, Inspire Awards, FIRST Tech Challenge Romanian Nationals.",
            "Champion of the 1st and 2nd editions of the Bucharest Twin Cup.",
          ],
          tags: ["Leadership", "Mentoring", "Fusion 360", "3D modeling", "Assembly"],
          links: [
            { label: "Team website", url: "https://cyliis.ro/" },
            { label: "Team GitHub", url: "https://github.com/Cyliis" },
          ],
        },
        {
          title: "B.A.R.K: Big Automated Robot Kanine",
          subtitle: "Quadruped robot, built with my brother Codrin Crismariu",
          meta: "2022",
          text: "A quadruped with 12 degrees of freedom. Each leg is driven by inverse kinematics, and filtered IMU readings adjust the legs in real time to help it balance on slopes and obstacles. A phone on the robot streams its camera to a laptop, which can run TFLite object detection.",
          bullets: ["We split the design and programming equally."],
          tags: ["Java", "Inverse kinematics", "IMU", "TensorFlow Lite"],
          links: [
            { label: "Code", url: "https://github.com/CodrinCrismariu/B.A.R.K" },
          ],
        },
      ],
    },
    {
      id: "experience",
      label: "Experience",
      items: [
        {
          title: "ddroidd",
          subtitle: "AI Engineer Trainee, then Junior Software Engineer from January 2026",
          meta: "September 2025 – August 2026",
          children: [
            {
              title: "Skill Hub",
              text: "An on-premise registry for sharing AI agent skills and collections, replacing ad hoc sharing over chat and repositories. Includes tag filtering, downloadable packs, versioning, ratings and company-email sign-in.",
              tags: ["Python", "FastAPI", "Jinja2", "Docker"],
            },
            {
              title: "Bootstrap: project generator",
              text: "A CLI, wizard and REST endpoint that generate ready-to-run Docker Compose projects for Python, Java (Spring Boot) and React (Next.js). Templates live in a separate repository, so any team can customize them or add a language or service.",
              tags: ["Python", "FastAPI", "Jinja2", "Docker"],
            },
            {
              title: "Ticketing middleware",
              text: "A Fastify service that turns issues from the company's core application into Desk365 tickets, which were previously entered by hand. Multi-tenant, with per-organization Keycloak realms, JWT verification and role-based Redis rate limiting.",
              tags: ["Node.js", "Keycloak", "Redis", "Docker"],
            },
          ],
        },
      ],
    },
    {
      id: "education",
      label: "Education",
      compact: true,
      items: [
        {
          title: "Eindhoven University of Technology (TU/e)",
          subtitle: "Master's, Data Science and Artificial Intelligence",
          meta: "2026 – 2028",
        },
        {
          title: "Alexandru Ioan Cuza University",
          subtitle: "Bachelor's, Computer Science",
          meta: "2023 – 2026",
          text: "Bachelor's thesis graded 10/10.",
        },
      ],
    },
    {
      id: "skills",
      label: "Skills",
      compact: true,
      items: [
        { title: "ML and data", tags: ["PyTorch", "TensorFlow", "NumPy", "pandas", "scikit-learn", "Matplotlib", "Jupyter"] },
        { title: "Languages", tags: ["Python", "C++", "C", "Java", "JavaScript (Node.js)"] },
        { title: "Frameworks and tools", tags: ["FastAPI", "Docker", "Git", "Linux", "Fusion 360"] },
        { title: "Spoken", tags: ["Romanian (native)", "English (C1)"] },
      ],
    },
  ],

  footer: {
    links: [{ label: "Source", url: "https://github.com/crismariudenis/Portofolio" }],
  },
};
