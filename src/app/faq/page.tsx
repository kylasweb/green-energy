import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, Zap, Battery, Sun, Settings, Phone } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ | Green Energy Solutions",
  description: "Find answers to frequently asked questions about our products, services, warranty, and shipping."
}

export default function FAQPage() {
  const categories = [
    { icon: Zap, title: "Inverters & UPS", count: 12 },
    { icon: Battery, title: "Batteries", count: 8 },
    { icon: Sun, title: "Solar Systems", count: 15 },
    { icon: Settings, title: "Installation & Service", count: 10 },
  ]

  const faqs = {
    general: [
      {
        question: "What products does Green Energy Solutions offer?",
        answer: "We offer a comprehensive range of renewable energy products including inverters, UPS systems, batteries, solar panels, solar water heaters, and related accessories from top brands like Luminous, Exide, Microtek, and more."
      },
      {
        question: "Do you provide installation services?", 
        answer: "Yes, we provide professional installation services for all our products. Our certified technicians ensure proper installation and setup according to manufacturer guidelines and safety standards."
      },
      {
        question: "What areas do you serve?",
        answer: "We serve customers across India with delivery to 200+ cities. Our service network covers all major metros and tier-1 cities with expanding coverage in smaller towns."
      },
      {
        question: "How can I track my order?",
        answer: "You can track your order using the order number and email address on our Track Order page, or through the tracking link sent via SMS and email after shipment."
      }
    ],
    inverters: [
      {
        question: "What size inverter do I need for my home?",
        answer: "The inverter size depends on your power requirements. For basic lighting and fans (3-4 rooms), a 600VA-850VA inverter works. For running appliances like refrigerator and TV, consider 1.5KVA-3KVA. Our experts can help you calculate the exact requirement."
      },
      {
        question: "What's the difference between Pure Sine Wave and Modified Sine Wave inverters?",
        answer: "Pure Sine Wave inverters produce clean power similar to grid electricity, suitable for sensitive electronics. Modified Sine Wave inverters are cost-effective but may cause humming in some appliances. We recommend Pure Sine Wave for better appliance compatibility."
      },
      {
        question: "How long do inverters typically last?",
        answer: "Quality inverters typically last 8-15 years with proper maintenance. Factors affecting lifespan include usage patterns, environmental conditions, and maintenance frequency. Regular servicing can extend inverter life significantly."
      },
      {
        question: "Can I use my inverter during power cuts and grid power simultaneously?",
        answer: "Yes, modern inverters have automatic changeover functionality. They switch to battery mode during power cuts and automatically revert to mains power when electricity returns, ensuring uninterrupted power supply."
      }
    ],
    batteries: [
      {
        question: "How do I choose the right battery for my inverter?",
        answer: "Battery capacity should match your backup time requirements. Calculate total watt-hours needed and divide by battery voltage. For example, if you need 1000Wh backup with a 12V system, you need at least 83Ah battery capacity. Consider 20-30% extra for efficiency losses."
      },
      {
        question: "What's the difference between Tubular and Flat Plate batteries?",
        answer: "Tubular batteries offer longer life (4-6 years), better deep discharge capability, and higher efficiency but cost more. Flat plate batteries are economical with 2-3 years life. For frequent power cuts, tubular batteries are recommended."
      },
      {
        question: "How often should I maintain my inverter battery?",
        answer: "Check battery water levels monthly (for maintainable batteries), clean terminals every 3 months, and ensure proper ventilation. Fully charge/discharge the battery monthly to maintain health. Professional servicing every 6 months is recommended."
      },
      {
        question: "Why is my battery backup time reducing?",
        answer: "Common reasons include battery aging, loose connections, overloading, improper charging, or water level issues. Check connections, reduce load, maintain water levels, and consider battery replacement if it's over 3-4 years old."
      }
    ],
    solar: [
      {
        question: "How much can I save with solar installation?",
        answer: "Solar installations typically reduce electricity bills by 70-90%. A 3KW system can save ₹15,000-25,000 annually depending on your location and usage patterns. Complete payback typically occurs within 4-6 years."
      },
      {
        question: "What size solar system do I need for my home?",
        answer: "System size depends on your monthly electricity consumption. As a rule of thumb, 1KW solar generates 4-5 units daily. Check your electricity bill for monthly consumption and divide by 120-150 to get approximate KW requirement."
      },
      {
        question: "Do solar panels work during monsoons and cloudy days?",
        answer: "Solar panels work in cloudy conditions but with reduced efficiency (10-25% of normal output). During heavy rain, output drops significantly. However, annual generation remains profitable due to excellent performance in sunny months."
      },
      {
        question: "What maintenance do solar panels require?",
        answer: "Solar panels require minimal maintenance - mainly cleaning dust and debris monthly, checking for physical damage, ensuring proper connections, and monitoring performance. Professional inspection annually is recommended."
      },
      {
        question: "Are there government subsidies for solar installation?",
        answer: "Yes, the government offers subsidies up to 40% for residential solar installations under PM-KUSUM and other schemes. Additional benefits include accelerated depreciation for businesses and net metering policies for excess power sale."
      }
    ],
    service: [
      {
        question: "Do you provide installation services?",
        answer: "Yes, we provide complete installation services through our certified technician network. Installation includes site survey, system design, professional installation, testing, and commissioning with proper documentation."
      },
      {
        question: "What is included in your AMC (Annual Maintenance Contract)?",
        answer: "Our AMC includes preventive maintenance visits, cleaning, testing, minor repairs, replacement of small components, performance monitoring, and priority support. Different AMC plans available based on system type and requirements."
      },
      {
        question: "How quickly can you provide service support?",
        answer: "We provide same-day response for emergency issues in major cities, and within 24-48 hours in other areas. Routine maintenance is scheduled based on your convenience within a week of request."
      },
      {
        question: "Do you service products bought from other dealers?",
        answer: "Yes, we service all major brands regardless of purchase source. Service charges apply for out-of-warranty products. We maintain inventory of common spare parts for faster resolution."
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">Frequently Asked Questions</Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Can We Help You?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Find quick answers to common questions about our products and services
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for answers..."
                  className="pl-12 py-3 text-lg glass-input"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="glass-card text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <category.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                    <Badge variant="secondary">{category.count} questions</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* General FAQs */}
          <section className="mb-16">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-green-600" />
                  General Questions
                </CardTitle>
                <CardDescription>
                  Common questions about our company and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {faqs.general.map((faq, index) => (
                    <AccordionItem key={index} value={`general-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Inverter FAQs */}
          <section className="mb-16">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                  Inverters & UPS
                </CardTitle>
                <CardDescription>
                  Everything about inverters and UPS systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {faqs.inverters.map((faq, index) => (
                    <AccordionItem key={index} value={`inverter-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Battery FAQs */}
          <section className="mb-16">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-6 w-6 text-orange-600" />
                  Batteries
                </CardTitle>
                <CardDescription>
                  Battery selection, maintenance, and troubleshooting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {faqs.batteries.map((faq, index) => (
                    <AccordionItem key={index} value={`battery-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Solar FAQs */}
          <section className="mb-16">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-6 w-6 text-yellow-600" />
                  Solar Systems
                </CardTitle>
                <CardDescription>
                  Solar installation, benefits, and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {faqs.solar.map((faq, index) => (
                    <AccordionItem key={index} value={`solar-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Service FAQs */}
          <section className="mb-16">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-purple-600" />
                  Installation & Service
                </CardTitle>
                <CardDescription>
                  Installation services and maintenance support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {faqs.service.map((faq, index) => (
                    <AccordionItem key={index} value={`service-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Still Need Help */}
          <section>
            <Card className="glass-card text-center">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Can't find the answer you're looking for? Our expert support team is here to help you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700" asChild>
                    <Link href="/contact">
                      Contact Support
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call +91 98765 43210
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}