import React from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Grainient from './Grainient'
import StarBorder from './StarBorder'
import CircularCarousel from './CircularCarousel'
import './CircularCarousel.css'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: '01',
    title: '《我养的废宠竟全是上古大佬》',
    type: 'AI 短剧 · 全流程制作 · 60 集',
    year: '2026',
    image: '/fepet-cover.webp',
    accent: 'violet',
  },
  {
    number: '02',
    title: '2D动漫测试画面',
    type: '2D animation · Action test',
    year: '2026',
    video: '/anime-test.mp4',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1800&q=88',
    accent: 'blue',
  },
  {
    number: '03',
    title: '个人自制短篇',
    type: 'AIGC short film · Visual storytelling',
    year: '2026',
    video: '/personal-short-film.mp4',
    autoplay: false,
    controls: true,
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=88',
    accent: 'orange',
  },
]

const processSteps = [
  ['00', '剧本初审 & 归档定调', '先理解，再制作。通读原始剧本，梳理主线、人设、关系、反转、每集看点与整体类型。', '统一人设档案 · 筛查逻辑漏洞 · 留存修改记录'],
  ['01', '标准化短剧演员台本', '把甲方粗糙文字转化为格式标准、动作清晰、情绪明确、场景完整的执行台本。', '对白规范 · 场景拆分 · 表演动作 · 情绪标记'],
  ['02', '专业短剧导演指令本', '在标准台本上叠加导演创作逻辑，加入镜头、情绪与调度，直接适配 AIGC 成片。', '景别 · 运镜 · 机位切换 · 画面调度'],
  ['03', '角色 / 场景 / 道具资产', '锁定导演台本后生成视觉资产。场景与道具使用 Midjourney、GPT，人物建立脸部参考与多视图。', '人物一致性 · 场景基准 · 道具资产库'],
  ['04', '视频素材生成', '使用 Seedance 或其他 AI 视频模块输出镜头，保持人物站位连续、画面风格统一。', '连续动作 · 角色一致 · 镜头衔接'],
  ['05', '视频剪辑 & 交付', '完成素材拼接、音乐、音效、字幕与特效适配，导出完整短剧视频。', '剪辑节奏 · 声画同步 · 成片导出'],
]

const galleryImages = [
  ['Snow Shore Lighthouse', '/lighthouse-scene.webp'],
  ['Blue House / Quiet Frame', '/gallery-01.webp'],
  ['Rain / Monochrome Study', '/gallery-02.webp'],
  ['Cloud Gate / Mythic World', '/gallery-03.webp'],
  ['Warm Light / Character Study', '/gallery-04.webp'],
  ['Red Wind / Motion Frame', '/gallery-05.webp'],
  ['Rain Temple / Quiet Scene', '/gallery-06.webp'],
  ['Ash Dragon / Action Keyframe', '/gallery-07.webp'],
  ['Beyond the Gate / World Building', '/gallery-08.webp'],
]

function Arrow({ className = '' }) {
  return <span className={`arrow ${className}`} aria-hidden="true">↗</span>
}

function LazyProjectVideo({ project }) {
  const videoRef = React.useRef(null)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const node = videoRef.current
    if (!node) return undefined
    if (!('IntersectionObserver' in window)) {
      setReady(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setReady(true)
      observer.disconnect()
    }, { rootMargin: '420px 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <video ref={videoRef} autoPlay={project.autoplay !== false} muted playsInline loop={project.autoplay !== false} controls={project.controls === true} preload={ready ? (project.controls ? 'metadata' : 'auto') : 'none'} poster={project.image} aria-label={project.title}>
      {ready && <source src={project.video} type="video/mp4" />}
    </video>
  )
}

function ImageGallery() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const carouselShellRef = React.useRef(null)
  const jumpTo = index => {
    const carousel = carouselShellRef.current?.querySelector('.circular-carousel')
    if (!carousel) return
    const count = galleryImages.length
    let delta = index - activeIndex
    if (Math.abs(delta) > count / 2) delta += delta > 0 ? -count : count
    carousel.focus()
    const key = delta >= 0 ? 'ArrowRight' : 'ArrowLeft'
    Array.from({ length: Math.abs(delta) }).forEach((_, step) => window.setTimeout(() => carousel.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })), step * 40))
  }

  return (
    <section className="gallery section shell" id="gallery">
      <div className="section-head"><div className="section-label"><span>04</span><span>IMAGE LIBRARY</span></div><p>Selected stills<br />Visual experiments</p></div>
      <div className="gallery-heading"><h2>一些画面，<br /><span>先于语言抵达。</span></h2><p>来自角色、场景与世界观实验的视觉片段。</p></div>
      <div className="gallery-carousel-shell" ref={carouselShellRef}>
        <CircularCarousel items={galleryImages.map(([title, src]) => ({ src, alt: title, title, subtitle: 'Visual experiment' }))} preset="panorama" intro="spin" cardWidth={310} aspectRatio={1.6} gap={28} autoplay="drift" speed={4.8} direction="left" draggable pauseOnHover focusOnClick parallax={0.12} stretch={0.18} depthFade={0.54} fadeColor="#110e17" innerShade={0.72} cornerRadius={14} captions onChange={setActiveIndex} />
        <div className="gallery-carousel-dots" role="tablist" aria-label="图片导航">
          {galleryImages.map(([title], index) => <button key={title} type="button" className={activeIndex === index ? 'is-active' : ''} onClick={() => jumpTo(index)} aria-label={`查看第 ${index + 1} 张图片`} aria-selected={activeIndex === index} role="tab"><span /></button>)}
        </div>
      </div>
    </section>
  )
}

function App() {
  const [navFloating, setNavFloating] = React.useState(false)

  React.useEffect(() => {
    let scrollFrame = 0
    const updateNav = () => {
      if (scrollFrame) return
      scrollFrame = requestAnimationFrame(() => {
        setNavFloating(window.scrollY > window.innerHeight * 0.92)
        scrollFrame = 0
      })
    }
    updateNav()
    window.addEventListener('scroll', updateNav, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateNav)
      cancelAnimationFrame(scrollFrame)
    }
  }, [])

  React.useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const context = gsap.context(() => {
      const opening = gsap.timeline({ defaults: { ease: 'power4.out' } })
      opening
        .set('.hero-frame', { clipPath: 'inset(100% 0 0 0)' })
        .set('.hero-copy h1', { transformOrigin: 'left center', scaleX: 0.58, y: 74, opacity: 0 })
        .set('.hero-dark-kicker, .hero-statement, .hero-vertical-note, .hero-bottom', { opacity: 0, y: 24 })
        .set('.hero-abstract', { clipPath: 'inset(100% 0 0 0)', scale: 1.08 })
        .to('.hero-frame', { clipPath: 'inset(0% 0 0 0)', duration: 1.45, ease: 'power3.inOut' })
        .fromTo('.hero-frame .nav', { y: -28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=.65')
        .to('.hero-dark-kicker', { opacity: 1, y: 0, duration: 0.65 }, '-=.46')
        .to('.hero-copy h1', { opacity: 1, scaleX: 1, y: 0, duration: 1.45, ease: 'expo.out' }, '-=.45')
        .to('.hero-abstract', { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.25, ease: 'power3.inOut' }, '-=1.03')
        .to('.hero-statement, .hero-vertical-note, .hero-bottom', { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 }, '-=.55')

      gsap.utils.toArray('.section').forEach(section => {
        const label = section.querySelector('.section-label')
        const title = section.querySelector('h2')
        const cards = section.querySelectorAll('.process-card, .project-card')
        const media = section.querySelectorAll('.project-image img, .project-image video, .portrait-wrap, .gallery-slide img')

        if (label) {
          gsap.fromTo(label, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 82%', once: true } })
        }
        if (title) {
          gsap.fromTo(title, { y: 130, opacity: 0, scale: 0.84, clipPath: 'inset(0 0 100% 0)' }, { y: 0, opacity: 1, scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.25, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 74%', once: true } })
        }
        if (cards.length) {
          gsap.fromTo(cards, { y: 86, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 1.05, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: cards[0], start: 'top 82%', once: true } })
        }
        if (media.length) {
          gsap.fromTo(media, { clipPath: 'inset(100% 0 0 0)', scale: 1.08 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.25, stagger: 0.12, ease: 'power3.inOut', scrollTrigger: { trigger: media[0], start: 'top 84%', once: true } })
          media.forEach(item => gsap.to(item, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1.4 } }))
        }
      })
      ScrollTrigger.refresh()
    })

    return () => context.revert()
  }, [])

  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-frame">
          <video className="hero-video" autoPlay muted loop playsInline preload="metadata" fetchPriority="low" poster="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=76">
            <source src="/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="hero-paper" />
          <nav className={`nav ${navFloating ? 'nav-floating' : ''}`}>
            <a className="wordmark hero-dark" href="#top" aria-label="Haijun home"><span className="wordmark-mark">H</span><span>HAIJUN<span className="wordmark-dot">.</span></span></a>
            <div className="nav-links hero-dark-links">
              <a href="#about">经历</a>
              <a href="#process">流程</a>
              <a href="#work">项目</a>
              <a href="#gallery">图片</a>
            </div>
            <a className="contact-pill hero-contact" href="#contact">联系我 <Arrow /></a>
          </nav>
          <div className="hero-stage">
            <div className="hero-copy">
              <div className="hero-kicker hero-dark-kicker"><span className="status-dot" /> AI VISUAL DESIGNER / HAIKOU / 2026</div>
              <h1><span>HAIJUN</span><b>.</b></h1>
              <p className="hero-statement">我不只是生成画面。<br /><em>我把故事做成影像。</em></p>
            </div>
            <div className="hero-visual">
              <div className="hero-abstract"><span className="hero-abstract-grid" /></div>
              <div className="hero-vertical-note">HUANG HAIJUN<br />AI MAKER / FILM</div>
            </div>
          </div>
          <div className="hero-bottom"><span>+1</span><span>脚本 · 分镜 · 生成 · 成片</span><a href="#about">SCROLL TO EXPLORE ↓</a></div>
        </div>
      </section>

      <nav className="floating-nav is-visible" aria-label="页面导航">
        <a className="wordmark" href="#top" aria-label="Haijun home"><span className="wordmark-mark">H</span><span>HAIJUN<span className="wordmark-dot">.</span></span></a>
        <div className="nav-links">
          <a href="#about">经历</a>
          <a href="#process">流程</a>
          <a href="#work">项目</a>
          <a href="#gallery">图片</a>
        </div>
        <a className="contact-pill" href="#contact">联系我 <Arrow /></a>
      </nav>

      <section className="about section shell" id="about">
        <div className="grainient-bg" aria-hidden="true"><Grainient colors={["#0d0f10", "#161629", "#30214b", "#52619b", "#b9d96b"]} angle={145} flow={1.1} silk={0.42} grainAmount={0.06} grainAnimated={false} dpr={1.25} scale={0.9} speed={0.24} contrast={0.95} stir={0.85} /></div>
        <div className="section-label"><span>01</span><span>PROFILE</span></div>
        <div className="about-grid">
          <div className="portrait-wrap">
            <div className="portrait-glow" />
            <div className="portrait-card">
              <span className="portrait-word" aria-hidden="true"><span>AUDIOVISUAL</span><span>LANGUAGE</span></span>
              <span className="portrait-orbit portrait-orbit-a" aria-hidden="true" />
              <span className="portrait-orbit portrait-orbit-b" aria-hidden="true" />
              <span className="portrait-crosshair portrait-crosshair-a" aria-hidden="true" />
              <span className="portrait-crosshair portrait-crosshair-b" aria-hidden="true" />
              <img className="profile-cutout" src="/haijun-cutout.webp" alt="黄海俊人物肖像" loading="lazy" decoding="async" />
              <span className="portrait-label">AI / VISUAL / 01</span>
              <span className="portrait-coordinate">H. HAIJUN<br />VISUAL DESIGNER</span>
            </div>
            <div className="portrait-caption"><span>Haikou / China</span><span>20° N, 110° E</span></div>
          </div>
          <div className="about-copy">
            <p className="eyebrow">Hello, I am Haijun.</p>
            <h2>我用 AI 与镜头<br /><span>把故事变得可见。</span></h2>
            <p className="body-copy">我叫黄海俊，是一名 AI 制作师与视觉设计师，毕业于成都理工大学。擅长从脚本拆解、分镜设计，到角色与场景生成、视频制作和成片交付的完整流程。</p>
            <p className="body-copy muted">我在画面审美、镜头调度与剧情情绪之间寻找准确的平衡。</p>
          </div>
          <div className="stats">
            <div className="stat"><strong>04</strong><span>短剧产出</span></div>
            <div className="stat"><strong>60</strong><span>单项目集数</span></div>
            <div className="stat"><strong>01</strong><span>项目组长</span></div>
          </div>
        </div>
      </section>

      <section className="process section shell" id="process">
        <div className="section-head"><div className="section-label"><span>02</span><span>AIGC SOP</span></div><p>Original script<br />to final film</p></div>
        <div className="process-heading"><h2>把原始剧本<br /><span>变成可执行的影像。</span></h2><p>一套面向 AIGC 短剧的标准化导演流程。让创意从文字开始，经过拆解、设计、生成与剪辑，稳定抵达成片。</p></div>
        <div className="process-line" aria-hidden="true" />
        <div className="process-grid">{processSteps.map(([num, title, desc, tags]) => <StarBorder as="article" className={`process-card ${num === '00' ? 'process-card-featured' : ''}`} key={num} color={num === '00' ? '#d9ff4f' : '#aab7ff'} trailColor={num === '00' ? '#ff583d' : '#52619b'} duration={num === '00' ? 3.4 : 4.6} direction={num === '00' ? 'counterclockwise' : 'clockwise'} stars={1} trailLength={0.32} thickness={1.2} radius={3} glow={0.55} hover="lap" hoverOnly sparkle={num === '00'} clickPulse theme="dark"><div className="process-card-top"><span>{num}</span><span className="process-arrow">↗</span></div><h3>{title}</h3><p>{desc}</p><div className="process-tags">{tags.split(' · ').map(tag => <span key={tag}>{tag}</span>)}</div></StarBorder>)}</div>
      </section>

      <section className="work section shell" id="work">
        <div className="section-head"><div className="section-label"><span>03</span><span>SELECTED WORK</span></div><p>Selected projects<br />2026</p></div>
        <div className="projects">
          {projects.map((project) => (
            <article className={`project-card ${project.accent}`} key={project.number}>
              <div className="project-image">{project.video ? <LazyProjectVideo project={project} /> : <img src={project.image} alt={project.title} loading="lazy" decoding="async" fetchPriority="low" />}<div className="image-overlay" /><span className="project-number">{project.number}</span><span className="project-year">{project.year}</span></div>
              <div className="project-meta"><div><h3>{project.title}</h3><p>{project.type}</p></div><a href="#contact" className="round-arrow" aria-label={`查看 ${project.title}`}><Arrow /></a></div>
            </article>
          ))}
        </div>
        <a href="#contact" className="all-work">查看全部项目 <Arrow /></a>
      </section>

      <ImageGallery />

      <section className="contact section" id="contact">
        <div className="contact-orb orb-one" /><div className="contact-orb orb-two" />
        <div className="contact-inner shell"><div className="section-label"><span>05</span><span>GET IN TOUCH</span></div><div className="contact-main"><p className="eyebrow">Have a good feeling?</p><h2>一起做点<br /><em>有意思的事。</em></h2><a className="contact-email" href="mailto:2059990357@qq.com">2059990357@qq.com <Arrow /></a><div className="contact-details"><span>电话 / 17384936823</span><span>微信 / hhj769467290</span></div></div><div className="contact-bottom"><span>© 2026 HUANG HAIJUN</span><div><a href="#top">AI VISUALS</a><a href="#top">FILMMAKING</a><a href="#top">海口</a></div><a href="#top" className="back-top">回到顶部 ↑</a></div></div>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
