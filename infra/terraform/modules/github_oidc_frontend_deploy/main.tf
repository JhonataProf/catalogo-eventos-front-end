# IAM role para GitHub Actions publicar o front (S3 sync + invalidação CloudFront) via OIDC.
# Aplique uma vez por conta AWS (o OIDC provider GitHub costuma ser compartilhado entre repos).
#
# Após apply: configure no GitHub → Settings → Variables → AWS_ROLE_TO_ASSUME = arn:aws:iam::ACCOUNT:role/...

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

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
  description = "Se true, qualquer branch do repo pode assumir a role (laboratório). Em produção restrinja ref/tag."
  type        = bool
  default     = true
}

variable "allowed_ref_pattern" {
  description = "Quando allow_all_branches=false, padrão do claim sub (ex.: repo:org/repo:ref:refs/heads/main)."
  type        = string
  default     = ""
}

data "aws_iam_policy_document" "assume_github" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    dynamic "condition" {
      for_each = var.allow_all_branches ? [1] : []
      content {
        test     = "StringLike"
        variable = "token.actions.githubusercontent.com:sub"
        values   = ["repo:${var.github_org}/${var.github_repo}:*"]
      }
    }
    dynamic "condition" {
      for_each = var.allow_all_branches ? [] : [1]
      content {
        test     = "StringEquals"
        variable = "token.actions.githubusercontent.com:sub"
        values   = [var.allowed_ref_pattern]
      }
    }
  }
}

# Thumbprint oficial GitHub Actions (atualize se a AWS documentar mudança).
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

resource "aws_iam_role" "github_deploy" {
  name               = var.role_name
  assume_role_policy = data.aws_iam_policy_document.assume_github.json
}

data "aws_iam_policy_document" "deploy" {
  statement {
    sid    = "S3SyncDist"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      var.s3_bucket_arn,
      "${var.s3_bucket_arn}/*",
    ]
  }

  statement {
    sid       = "CloudFrontInvalidate"
    effect    = "Allow"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [var.cloudfront_distribution_arn]
  }
}

resource "aws_iam_role_policy" "github_deploy" {
  name   = "${var.role_name}-policy"
  role   = aws_iam_role.github_deploy.id
  policy = data.aws_iam_policy_document.deploy.json
}

output "role_arn" {
  value       = aws_iam_role.github_deploy.arn
  description = "Use como variável AWS_ROLE_TO_ASSUME no GitHub Actions."
}
