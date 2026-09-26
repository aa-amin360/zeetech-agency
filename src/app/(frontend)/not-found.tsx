import { ArrowUpRight, DisplayTitle, Eyebrow } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="sec" style={{ background: '#f6f6f6', minHeight: '80svh', display: 'grid', alignItems: 'center' }}>
      <div className="sec__inner" style={{ paddingTop: 160 }}>
        <header className="sec-head">
          <Eyebrow>404</Eyebrow>
          <DisplayTitle as="h1" heading={{ title: 'This page wandered off.', accent: 'Let’s get you back.' }} />
          <p className="sub">The page you’re looking for doesn’t exist or has moved.</p>
          <a className="btn btn--primary" href="/">
            <span>Back to the homepage</span>
            <ArrowUpRight />
          </a>
        </header>
      </div>
    </section>
  )
}
