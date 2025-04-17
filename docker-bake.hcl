group "default" {
  targets = ["app"]
}

variable "TURBO_TEAM" {
  default = ""

  validation {
    condition = TURBO_TEAM != ""
    error_message = "'TURBO_TEAM' must not be empty"
  }

  validation {
    condition = TURBO_TOKEN != ""
    error_message = "'TURBO_TEAM' requires 'TURBO_TOKEN' to be set"
  }
}

variable "TURBO_TOKEN" {
  default = ""

  validation {
    condition = TURBO_TOKEN != ""
    error_message = "'TURBO_TOKEN' must not be empty"
  }

  validation {
    condition = TURBO_TEAM != ""
    error_message = "'TURBO_TOKEN' requires 'TURBO_TEAM' to be set"
  }
}

target "app" {
  matrix = {
    project = ["frontend", "backend"]
  }

  name = project
  target = project

  secret = [
    { type = "env", id = "TURBO_TEAM" },
    { type = "env", id = "TURBO_TOKEN" },
  ]

  args = {
    PROJECT = project
  }

  tags = ["${project}:latest", "leosuncin/conduit-monorepo-${project}:latest"]

  cache-from = [
    { type = "registry", ref = "leosuncin/conduit-monorepo-${project}:cache" },
  ]

  cache-to = [
    { type = "registry", mode = "max", ref = "leosuncin/conduit-monorepo-${project}:cache" },
  ]
}
