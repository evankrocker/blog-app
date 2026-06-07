---
layout: default
title: Projects
permalink: /projects/
---

<!-- Page header -->
<section class="bg-dark text-white py-5">
  <div class="container py-md-3">
    <h1 class="display-5 fw-bold mb-3">Projects</h1>
    <p class="lead text-white-50 mb-0">Things I've built — from side projects to production tools.</p>
  </div>
</section>

<!-- Project grid -->
<div class="container py-5">
  <div class="row g-4">
    {% for project in site.data.projects %}
      <div class="col-sm-6 col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-4">

            <!-- Icon + title + status -->
            <div class="d-flex align-items-start gap-3 mb-3">
              <div class="project-icon flex-shrink-0"
                   style="background-color:{{ project.icon_bg }};color:{{ project.icon_color }};">
                <i class="bi {{ project.icon }}"></i>
              </div>
              <div class="flex-grow-1 min-w-0">
                <div class="d-flex align-items-start justify-content-between gap-2">
                  <h2 class="h6 fw-bold mb-1">{{ project.title }}</h2>
                  {% if project.status == "active" %}
                    <span class="badge bg-success-subtle text-success border border-success-subtle flex-shrink-0">Active</span>
                  {% elsif project.status == "in-progress" %}
                    <span class="badge bg-warning-subtle text-warning border border-warning-subtle flex-shrink-0">In Progress</span>
                  {% else %}
                    <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle flex-shrink-0">Archived</span>
                  {% endif %}
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-secondary small mb-3">{{ project.description }}</p>

            <!-- Tech stack tags -->
            <div class="d-flex flex-wrap gap-1 mb-4">
              {% for tag in project.tech %}
                <span class="badge bg-light text-secondary border">{{ tag }}</span>
              {% endfor %}
            </div>

          </div>

          <!-- Buttons in card footer -->
          <div class="card-footer bg-white border-0 px-4 pb-4">
            <div class="d-flex gap-2">
              <a href="{{ project.github }}" class="btn btn-outline-dark btn-sm">
                <i class="bi bi-github me-1"></i>Code
              </a>
              {% if project.demo %}
                <a href="{{ project.demo }}" class="btn btn-primary btn-sm">
                  <i class="bi bi-box-arrow-up-right me-1"></i>Demo
                </a>
              {% endif %}
            </div>
          </div>

        </div>
      </div>
    {% endfor %}
  </div>
</div>
