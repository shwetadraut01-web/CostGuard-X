resource "aws_amplify_app" "costguard_frontend" {
  name       = "${var.project_name}-frontend"
  repository = "https://github.com/user/costguard-x"

  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - cd frontend
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: frontend/dist
        files:
          - '**/*'
      cache:
        paths:
          - frontend/node_modules/**/*
  EOT

  custom_rule {
    source = "/<*>"
    target = "/index.html"
    status = "200"
  }
}

resource "aws_amplify_branch" "main_branch" {
  app_id      = aws_amplify_app.costguard_frontend.id
  branch_name = "main"
}
