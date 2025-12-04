'use client';

import { Sun, Moon, Github, Twitter, Mail, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';

export default function Page() {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
    <div
      className={`min-h-screen transition-colors duration-500 ${isDark ? 'gradient-bg-dark' : 'gradient-bg-light'}`}
    >
      {/* Header */}
      <header className={`border-b backdrop-blur-sm bg-opacity-80 sticky top-0 z-50 ${isDark ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => scrollToSection('about')}
                className={`text-[10px] font-light tracking-wide transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                [about]
              </button>
              <button
                onClick={() => scrollToSection('current')}
                className={`text-[10px] font-light tracking-wide transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                [current]
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-[10px] font-light tracking-wide transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                [contact]
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-6 w-6 p-0 rounded-none transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95 active:rotate-0"
            >
              <div className="transition-transform duration-500 ease-in-out">
                {isDark ? <Sun className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Moon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
              </div>
            </Button>
          </nav>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <section
          id="about"
          className="mb-16 sm:mb-20"
        >
          <div className={`mb-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <h1 className={`text-xs sm:text-sm font-light mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>$ whoami</h1>
            <p className={`text-[10px] sm:text-xs font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>suhail@portfolio:~</p>
          </div>

          <p className={`text-[11px] sm:text-xs leading-relaxed mb-4 max-w-xl font-light transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            software engineer // amsterdam, the netherlands<br />
            web development + machine learning<br />
            building meaningful digital experiences
          </p>

          <div className={`flex flex-wrap gap-1.5 mb-4 transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <Badge
              variant="outline"
              className={`text-[9px] px-1.5 py-0.5 rounded-none font-light ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-400 text-gray-600'}`}
            >
              fullstack
            </Badge>
            <Badge
              variant="outline"
              className={`text-[9px] px-1.5 py-0.5 rounded-none font-light ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-400 text-gray-600'}`}
            >
              ml/ai
            </Badge>
            <Badge
              variant="outline"
              className={`text-[9px] px-1.5 py-0.5 rounded-none font-light ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-400 text-gray-600'}`}
            >
              oss
            </Badge>
          </div>

          <div className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-500 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 text-[9px] sm:text-[10px] px-1.5 sm:px-2 rounded-none font-light transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={() => scrollToSection('contact')}
            >
              <Mail className="h-2.5 w-2.5 mr-1" />
              mail
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 text-[9px] sm:text-[10px] px-1.5 sm:px-2 rounded-none font-light transition-all duration-200 hover:scale-105 active:scale-95"
              asChild
            >
              <a href="https://github.com/sewhail" target="_blank" rel="noopener noreferrer">
                <Github className="h-2.5 w-2.5 mr-1" />
                github
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 text-[9px] sm:text-[10px] px-1.5 sm:px-2 rounded-none font-light transition-all duration-200 hover:scale-105 active:scale-95"
              asChild
            >
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-2.5 w-2.5 mr-1" />
                twitter
              </a>
            </Button>
          </div>
        </section>

        {/* Current Ongoings Section */}
        <section id="current" className="mb-16 sm:mb-20 pt-8">
          <div className="flex items-center gap-2 mb-5">
            <span className={`text-[10px] animate-pulse ${isDark ? 'text-green-400' : 'text-green-500'}`}>●</span>
            <h2 className={`text-[11px] sm:text-xs font-light tracking-wider ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>/current</h2>
          </div>

          <div className="space-y-1.5">
            {[
              { prefix: '>', text: 'exploring ml fundamentals' },
              { prefix: '>', text: 'mathematical concepts deep dive' },
              { prefix: '>', text: 'advancing python skills' },
              { prefix: '>', text: 'building practical projects' },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 px-2 py-1.5 sm:py-1 transition-all duration-300 ease-out hover:translate-x-2 hover:scale-[1.02] active:scale-[0.96] active:translate-x-3 hover:bg-opacity-100 cursor-pointer group ${isDark ? 'hover:bg-gray-800/40 active:bg-gray-800/60' : 'hover:bg-gray-100/40 active:bg-gray-200/60'
                  }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className={`text-[9px] sm:text-[10px] font-light transition-colors duration-300 ${isDark ? 'text-gray-500 group-hover:text-gray-400 group-active:text-gray-300' : 'text-gray-400 group-hover:text-gray-500 group-active:text-gray-600'}`}>{item.prefix}</span>
                <span className={`text-[9px] sm:text-[10px] font-light transition-colors duration-300 ${isDark ? 'text-gray-300 group-hover:text-gray-200 group-active:text-gray-100' : 'text-gray-600 group-hover:text-gray-700 group-active:text-gray-800'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-16 sm:mb-20 pt-8">
          <h2 className={`text-[11px] sm:text-xs font-light tracking-wider mb-5 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>/skills</h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2">
            {['js', 'py', 'react', 'node', 'ts', 'psql', 'docker', 'aws'].map((skill, index) => (
              <div
                key={skill}
                className={`px-2 py-2 sm:py-1.5 text-center border transition-all duration-300 hover:border-opacity-100 hover:-translate-y-1 hover:scale-105 active:scale-95 cursor-pointer ${isDark ? 'border-gray-800 bg-gray-900/40 hover:bg-gray-800/60 hover:border-gray-700 hover:shadow-lg hover:shadow-gray-800/20' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100/70 hover:border-gray-400 hover:shadow-md'}`}
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <span className={`text-[8px] sm:text-[9px] font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-16 pt-8">
          <h2 className={`text-[11px] sm:text-xs font-light tracking-wider mb-5 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>/contact</h2>

          <Card className={`border border-glow transition-all duration-300 hover:shadow-lg ${isDark ? 'border-gray-800 bg-gray-900/30 hover:border-gray-700' : 'border-gray-300 bg-gray-50/40 hover:border-gray-400'}`}>
            <CardContent className="p-3 sm:p-4">
              <p className={`text-[10px] mb-3 font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                open to opportunities + collaborations.<br />
                feel free to reach out.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-2.5 w-2.5 flex-shrink-0 mt-0.5" />
                  <a href="mailto:sxhail@outlook.in" className={`text-[9px] sm:text-[10px] font-light hover:underline leading-none ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    sxhail@outlook.in
                  </a>
                </div>
                <div className="flex items-center gap-2 sm:gap-1.5">
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-none transition-all duration-200 hover:scale-110 active:scale-90" asChild>
                    <a href="https://github.com/sewhail" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                      <Github className="h-2.5 w-2.5" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-none transition-all duration-200 hover:scale-110 active:scale-90" asChild>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                      <Twitter className="h-2.5 w-2.5" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-none transition-all duration-200 hover:scale-110 active:scale-90" asChild>
                    <a href="https://www.linkedin.com/in/sewhail/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                      <Linkedin className="h-2.5 w-2.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className={`border-t mt-20 transition-colors duration-300 backdrop-blur-sm ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-300 bg-white/50'}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className={`flex items-center justify-center text-[9px] font-light ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
            <span>© 2024 suhail</span>
            <Separator orientation="vertical" className="mx-2 h-2" />
            <span>next.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
