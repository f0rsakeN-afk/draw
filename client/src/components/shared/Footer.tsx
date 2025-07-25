import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Youtube, Instagram, Facebook, Linkedin, Mail, ArrowUp } from "lucide-react";
import { LogoImage } from "@/utils/ImageExports";
import { cn } from "@/lib/utils";

const Footer: React.FC = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About', to: '/about' },
        { name: 'Careers', to: '/careers' },
        { name: 'Blog', to: '/blog' },
        { name: 'Press', to: '/press' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', to: '/help' },
        { name: 'Contact Us', to: '/contact' },
        { name: 'Privacy Policy', to: '/privacy' },
        { name: 'Terms of Service', to: '/terms' },
      ],
    },
    {
      title: 'Features',
      links: [
        { name: 'Upload', to: '/upload' },
        { name: 'Channels', to: '/channels' },
        { name: 'Trending', to: '/trending' },
        { name: 'Live', to: '/live' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Github className="h-4 w-4" />, href: 'https://github.com', label: 'GitHub' },
    { icon: <Twitter className="h-4 w-4" />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Youtube className="h-4 w-4" />, href: 'https://youtube.com', label: 'YouTube' },
    { icon: <Instagram className="h-4 w-4" />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <Facebook className="h-4 w-4" />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Linkedin className="h-4 w-4" />, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand and description */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={LogoImage} 
                alt="Vizion Logo" 
                className="h-12 w-auto dark:invert"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Discover, watch, and share your favorite videos. Join our community of creators and viewers from around the world.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className={cn(
                        "text-sm text-muted-foreground hover:text-foreground transition-colors",
                        location.pathname === link.to ? "text-foreground font-medium" : ""
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <form className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-background"
              />
              <Button type="submit" size="sm" className="shrink-0">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Vizion, Inc. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={scrollToTop}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
