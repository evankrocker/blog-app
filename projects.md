---
layout: default
title: Projects
permalink: /projects/
---

<div class="container py-5">
  <div class="mb-5">
    <h1 class="fw-bold">Projects</h1>
    <p class="text-muted lead">Things I've built — from side projects to production tools.</p>
  </div>

  <div class="row g-4">
    {% for project in site.data.projects %}
      <div class="col-md-6 col-lg-4">
        <div class="card border-0 shadow-sm h-100 project-card">
          <div class="card-body p-4">
            <div class="d-flex align-items-start gap-3 mb-3">
              <div class="project-icon flex-shrink-0"
                   style="background-color:{{ project.icon_bg }}; color:{{ project.icon_color }};">
                <i class="bi {{ project.icon }}"></i>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex align-items-center justify-content-between gap-2 mb-1">
                  <h2 class="h6 fw-bold mb-0">{{ project.title }}</h2>
                  {% if project.status == "active" %}
                    <span class="badge status-badge-active">Active</span>
                  {% elsif project.status == "in-progress" %}
                    <span class="badge status-badge-in-progress">In Progress</span>
                  {% else %}
                    <span class="badge status-badge-archived">Archived</span>
                  {% endif %}
                </div>
              </div>
            </div>

            <p class="text-muted small mb-3">{{ project.description }}</p>

            <div class="d-flex flex-wrap gap-1 mb-4">
              {% for tag in project.tech %}
                <span class="tech-badge">{{ tag }}</span>
              {% endfor %}
            </div>

            <div class="d-flex gap-2 mt-auto">
              {% if project.github and project.github != "#" %}
                <a href="{{ project.github }}" class="btn btn-outline-dark btn-sm" target="_blank" rel="noopener">
                  <i class="bi bi-github"></i> Code
                </a>
              {% else %}
                <a href="{{ project.github }}" class="btn btn-outline-dark btn-sm">
                  <i class="bi bi-github"></i> Code
                </a>
              {% endif %}
              {% if project.demo %}
                {% if project.demo != "#" %}
                  <a href="{{ project.demo }}" class="btn btn-primary btn-sm" target="_blank" rel="noopener">
                    <i class="bi bi-box-arrow-up-right"></i> Demo
                  </a>
                {% else %}
                  <a href="{{ project.demo }}" class="btn btn-primary btn-sm">
                    <i class="bi bi-box-arrow-up-right"></i> Demo
                  </a>
                {% endif %}
              {% endif %}
            </div>
          </div>
        </div>
      </div>
    {% endfor %}
  </div>
</div>
