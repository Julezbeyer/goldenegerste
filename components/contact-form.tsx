"use client"

import type React from "react"

import { useState } from "react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setShowFeedback(true)
    setFormData({ name: "", email: "", message: "" })
    setIsSubmitting(false)

    // Hide feedback after 5 seconds
    setTimeout(() => {
      setShowFeedback(false)
    }, 5000)
  }

  return (
    <div className="contact-form-container">
      <form id="contact-form" onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-Mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Nachricht:</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" className="btn primary" disabled={isSubmitting}>
          {isSubmitting ? "Wird gesendet..." : "Absenden"}
        </button>

        {showFeedback && (
          <p id="form-feedback" className="form-feedback">
            Danke für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.
          </p>
        )}
      </form>
    </div>
  )
}
