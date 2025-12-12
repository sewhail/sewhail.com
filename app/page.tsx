'use client';

import { Sun, Moon, Github, Twitter, Mail, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect, useRef } from 'react';

// Custom hook for intersection observer animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

export default function Page() {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Section refs for scroll animations
  const currentSection = useInView();
  const stackSection = useInView();
  const contactSection = useInView();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'dark gradient-bg-dark' : 'gradient-bg-light'}`}>
      {/* Header - floating pill */}
      <header className="sticky top-0 z-50 pt-4 pb-2">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <nav className={`flex items-center justify-between px-4 py-2 rounded-full glass-header border transition-colors duration-300 ${isDark
              ? 'border-white/10 bg-black/50'
              : 'border-black/5 bg-white/70'
            }`}>
            <div className="flex items-center space-x-3 sm:space-x-5">
              {['about', 'current', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-[10px] sm:text-[11px] font-light tracking-wide transition-all duration-300 animated-underline ${isDark
                      ? 'text-gray-500 hover:text-emerald-400'
                      : 'text-gray-500 hover:text-emerald-600'
                    }`}
                >
                  [{section}]
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={`h-7 w-7 p-0 rounded-full transition-all duration-300 ${isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-emerald-400'
                  : 'hover:bg-black/5 text-gray-500 hover:text-emerald-600'
                }`}
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
          </nav>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <section id="about" className="mb-10 sm:mb-12">
          <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Avatar - more prominent */}
            <div className="avatar-glow flex-shrink-0">
              <Avatar className={`h-20 w-20 sm:h-24 sm:w-24 ring-2 transition-all duration-500 shadow-lg ${isDark
                ? 'ring-emerald-500/30 hover:ring-emerald-400/50 shadow-emerald-500/10'
                : 'ring-emerald-600/25 hover:ring-emerald-500/45 shadow-emerald-600/10'
                }`}>
                <AvatarImage src="/avatar.jpg" alt="Suhail" className="object-cover" />
                <AvatarFallback className={`text-sm font-light ${isDark ? 'bg-gray-900 text-emerald-400' : 'bg-gray-100 text-emerald-600'}`}>SH</AvatarFallback>
              </Avatar>
            </div>

            {/* Intro - cleaner, just the name */}
            <div className="text-center sm:text-left pt-0 sm:pt-3">
              <h1 className={`text-base sm:text-lg font-normal tracking-tight mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                suhail
              </h1>
              <p className={`text-[10px] sm:text-xs font-light ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                software engineer
              </p>
            </div>
          </div>

          <p className={`text-[10px] sm:text-xs leading-relaxed mb-5 max-w-lg font-light transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            software engineer // amsterdam, the netherlands<br />
            web development + machine learning<br />
            building meaningful digital experiences
          </p>

          <div className={`flex flex-wrap gap-2 mb-6 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {['fullstack', 'ml/ai', 'oss'].map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`text-[9px] px-1.5 py-0.5 font-light transition-all duration-300 skill-badge ${isDark
                  ? 'border-emerald-500/20 text-emerald-400/80 hover:border-emerald-400/40 hover:bg-emerald-400/5'
                  : 'border-emerald-600/30 text-emerald-700 hover:border-emerald-500/50 hover:bg-emerald-50'
                  }`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className={`flex items-center gap-2 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 text-[9px] sm:text-[10px] px-2 font-light transition-all duration-300 social-icon ${isDark
                ? 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/5'
                : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              onClick={() => scrollToSection('contact')}
            >
              <Mail className="h-3 w-3 mr-1.5" />
              contact
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 text-[9px] sm:text-[10px] px-2 font-light transition-all duration-300 social-icon ${isDark
                ? 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/5'
                : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              asChild
            >
              <a href="https://github.com/sewhail" target="_blank" rel="noopener noreferrer">
                <Github className="h-3 w-3 mr-1.5" />
                github
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 text-[9px] sm:text-[10px] px-2 font-light transition-all duration-300 social-icon ${isDark
                ? 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/5'
                : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              asChild
            >
              <a href="https://linkedin.com/in/sewhail" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-3 w-3 mr-1.5" />
                linkedin
              </a>
            </Button>
          </div>
        </section>

        {/* Subtle separator */}
        <div className="section-separator" />

        {/* Current Section */}
        <section
          id="current"
          className="mb-10 sm:mb-12"
          ref={currentSection.ref as React.RefObject<HTMLElement>}
        >
          <div className={`flex items-center gap-2 mb-4 transition-all duration-700 ${currentSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
            <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
            <h2 className={`text-[10px] sm:text-xs font-light tracking-wide ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              /current
            </h2>
          </div>

          <div className="space-y-0.5">
            {[
              'exploring ml fundamentals',
              'mathematical concepts deep dive',
              'advancing python skills',
              'building practical projects',
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 py-1 px-2 transition-all duration-500 group cursor-default ${currentSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  } ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]'}`}
                style={{ transitionDelay: currentSection.isInView ? `${index * 100 + 200}ms` : '0ms' }}
              >
                <span className={`text-[9px] transition-colors duration-300 ${isDark
                  ? 'text-gray-500 group-hover:text-emerald-400'
                  : 'text-gray-400 group-hover:text-emerald-600'
                  }`}>
                  &gt;
                </span>
                <span className={`text-[10px] font-light transition-colors duration-300 ${isDark
                  ? 'text-gray-400 group-hover:text-gray-300'
                  : 'text-gray-600 group-hover:text-gray-700'
                  }`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section
          className="mb-10 sm:mb-12"
          ref={stackSection.ref as React.RefObject<HTMLElement>}
        >
          <h2 className={`text-[10px] sm:text-xs font-light tracking-wide mb-4 transition-all duration-700 ${stackSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            /stack
          </h2>

          <div className="flex flex-wrap gap-2">
            {['js', 'py', 'react', 'node', 'ts', 'psql', 'docker', 'aws'].map((skill, index) => (
              <span
                key={skill}
                className={`px-2 py-1 text-[9px] sm:text-[10px] font-light border transition-all duration-500 cursor-default ${stackSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  } ${isDark
                    ? 'border-white/10 text-gray-400 hover:border-emerald-500/30 hover:text-emerald-400'
                    : 'border-black/10 text-gray-600 hover:border-emerald-500/40 hover:text-emerald-600'
                  }`}
                style={{ transitionDelay: stackSection.isInView ? `${index * 50 + 100}ms` : '0ms' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="mb-8"
          ref={contactSection.ref as React.RefObject<HTMLElement>}
        >
          <h2 className={`text-[10px] sm:text-xs font-light tracking-wide mb-4 transition-all duration-700 ${contactSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            /contact
          </h2>

          <Card className={`border transition-all duration-700 ${contactSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isDark
              ? 'border-white/10 bg-white/[0.02] hover:border-emerald-500/20'
              : 'border-black/10 bg-black/[0.01] hover:border-emerald-500/30'
            }`}
            style={{ transitionDelay: contactSection.isInView ? '150ms' : '0ms' }}
          >
            <CardContent className="p-3 sm:p-4">
              <p className={`text-[10px] sm:text-xs mb-3 font-light leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                open to opportunities and collaborations.<br />
                let's build something together.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <a
                  href="mailto:sxhail@outlook.in"
                  className={`inline-flex items-center gap-2 text-[10px] font-light transition-all duration-300 animated-underline ${isDark
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-emerald-600 hover:text-emerald-500'
                    }`}
                >
                  <Mail className="h-3 w-3" />
                  sxhail@outlook.in
                </a>

                <div className="flex items-center gap-1">
                  {[
                    { icon: Github, href: 'https://github.com/sewhail' },
                    { icon: Twitter, href: 'https://x.com' },
                    { icon: Linkedin, href: 'https://linkedin.com/in/sewhail' },
                  ].map(({ icon: Icon, href }) => (
                    <Button
                      key={href}
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 transition-all duration-300 social-icon ${isDark
                        ? 'text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/5'
                        : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      asChild
                    >
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className={`border-t transition-colors duration-300 ${isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-white/40'}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <div className={`flex items-center justify-center gap-2 text-[10px] font-light ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <span>© 2025</span>
            <span className={isDark ? 'text-emerald-500/50' : 'text-emerald-600/50'}>·</span>
            <span>suhail</span>
            <span className={isDark ? 'text-emerald-500/50' : 'text-emerald-600/50'}>·</span>
            <span>next.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
