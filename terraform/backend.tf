# Estado remoto en S3 (cuenta master AWS UG Manizales, us-east-1).
#
# El bucket aws-ug-manizales-tf-state-746669207643 se creó a mano (no puede
# vivir en el state que él mismo guarda): versioning + SSE AES256 + block
# public access. Locking nativo de S3 vía use_lockfile (Terraform >= 1.10),
# sin DynamoDB.
#
# El workflow de CI corre `terraform init -backend=false` para validación,
# así que este bloque no lo afecta.
terraform {
  backend "s3" {
    bucket       = "aws-ug-manizales-tf-state-746669207643"
    key          = "pagina-web/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
