output "instance_ip" {
  value = aws_instance.web.public_ip
}

output "public_key" {
  value = file("ssh-keys/id_rsa_aws.pub")
}
