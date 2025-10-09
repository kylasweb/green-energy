import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Briefcase, Users, TrendingUp, Heart, Send } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Careers | Green Energy Solutions",
  description: "Join our team at Green Energy Solutions and help build a sustainable future. Explore career opportunities and grow with us."
}

export default function CareersPage() {
  const openPositions = [
    {
      title: "Solar Installation Technician",
      department: "Technical Operations",
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      experience: "2-4 years",
      description: "Install and maintain solar panel systems for residential and commercial clients."
    },
    {
      title: "Sales Executive - Energy Solutions",
      department: "Sales & Marketing",
      location: "Delhi, NCR",
      type: "Full-time", 
      experience: "1-3 years",
      description: "Drive sales of renewable energy products and build relationships with customers."
    },
    {
      title: "Product Manager - Battery Technology",
      department: "Product Development",
      location: "Bangalore, Karnataka",
      type: "Full-time",
      experience: "5-7 years",
      description: "Lead product strategy and development for our battery and energy storage solutions."
    },
    {
      title: "Customer Support Specialist",
      department: "Customer Service",
      location: "Chennai, Tamil Nadu", 
      type: "Full-time",
      experience: "1-2 years",
      description: "Provide technical support and assistance to customers for all our products."
    },
    {
      title: "Field Service Engineer",
      department: "Technical Operations",
      location: "Pune, Maharashtra",
      type: "Full-time",
      experience: "3-5 years",
      description: "Provide on-site technical support and maintenance services for energy systems."
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Gurgaon, Haryana",
      type: "Full-time",
      experience: "2-4 years", 
      description: "Manage digital marketing campaigns and online presence for our brand."
    }
  ]

  const benefits = [
    "Competitive salary and performance bonuses",
    "Comprehensive health and medical insurance",
    "Professional development and training opportunities",
    "Flexible working arrangements",
    "Employee stock ownership program",
    "Annual team outings and events",
    "Work-life balance initiatives",
    "Green energy products at employee discounts"
  ]

  const values = [
    {
      icon: Heart,
      title: "People First",
      description: "We believe our employees are our greatest asset and invest in their growth and well-being."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We encourage creativity and innovation to solve the world's energy challenges."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We work together as one team to achieve our shared mission of sustainable energy."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">Join Our Team</Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Build Your Career in <span className="text-green-600">Green Energy</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join us in revolutionizing India's energy landscape and creating a sustainable future for generations to come
            </p>
          </div>

          {/* Company Culture */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Why Work With Us?
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Be part of a mission-driven company that's making a real difference
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {values.map((value, index) => (
                <Card key={index} className="glass-card text-center">
                  <CardContent className="p-6">
                    <value.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Benefits */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Employee Benefits & Perks</CardTitle>
                <CardDescription>
                  We offer comprehensive benefits to support your personal and professional growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Open Positions */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Open Positions
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Explore exciting career opportunities across different departments
              </p>
            </div>

            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <Card key={index} className="glass-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                              {position.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {position.department}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {position.location}
                              </div>
                              <Badge variant="secondary">{position.type}</Badge>
                              <span>Experience: {position.experience}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {position.description}
                        </p>
                      </div>
                      <div className="lg:ml-6">
                        <Button className="bg-green-600 hover:bg-green-700 w-full lg:w-auto">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Application Form */}
          <section className="mb-16">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-6 w-6 text-green-600" />
                  Don't See a Perfect Match?
                </CardTitle>
                <CardDescription>
                  Send us your resume and we'll consider you for future opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your full name" className="glass-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" className="glass-input" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+91 98765 43210" className="glass-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position of Interest</Label>
                    <Input id="position" placeholder="e.g. Sales, Technical, Marketing" className="glass-input" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" placeholder="e.g. 3 years" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Tell us why you'd like to join Green Energy Solutions..."
                    rows={4}
                    className="glass-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume/CV</Label>
                  <Input id="resume" type="file" accept=".pdf,.doc,.docx" className="glass-input" />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Contact HR */}
          <section>
            <Card className="glass-card text-center">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Questions About Careers?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our HR team is here to help you learn more about opportunities at Green Energy Solutions
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-lg font-semibold">📧 careers@greenenergysolutions.com</p>
                  <p className="text-lg font-semibold">📞 +91 98765 43210</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact HR Team</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}