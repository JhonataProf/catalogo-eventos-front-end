variable "role_name" {
  description = "Nome da role IAM (ex.: github-celeiro-front-deploy)."
  type        = string
}

variable "github_org" {
  description = "Organização ou usuário GitHub."
  type        = string
}

variable "github_repo" {
  description = "Nome do repositório (sem org)."
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN do bucket do site (ex.: module.spa.s3_bucket_arn)."
  type        = string
}

variable "cloudfront_distribution_arn" {
  description = "ARN da distribuição CloudFront."
  type        = string
}

variable "allow_all_branches" {
  description = "Se true, qualquer branch do repo pode assumir a role (apenas laboratório). Em produção use false e restrinja refs."
  type        = bool
  default     = false
}

variable "allowed_ref_pattern" {
  description = "Claim sub exato quando allow_all_branches=false. Vazio = apenas refs/heads/main."
  type        = string
  default     = ""
}

variable "create_oidc_provider" {
  description = "Se false, reutiliza o OIDC provider GitHub já existente na conta (evita conflito ao aplicar)."
  type        = bool
  default     = true
}
