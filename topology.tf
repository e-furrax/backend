resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_internet_gateway" "my_ig" {
  vpc_id = aws_vpc.my_vpc.id
}

resource "aws_route_table" "my_route_table" {
  vpc_id = aws_vpc.my_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_ig.id
  }
}

resource "aws_subnet" "my_subnet" {
  availability_zone = local.availability_zone
  cidr_block        = var.subnet_cidr_block
  vpc_id            = aws_vpc.my_vpc.id
  tags = {
    Name = "thomas.gorszczyk"
    User = "thomas.gorszczyk"
    TP   = "TP2"
  }
}

resource "aws_route_table_association" "my_route_table_association" {
  subnet_id      = aws_subnet.my_subnet.id
  route_table_id = aws_route_table.my_route_table.id
}

resource "aws_security_group" "my_security_group" {
  name_prefix = "thomas.gorszczyk"
  vpc_id      = aws_vpc.my_vpc.id
  tags = {
    Name = "thomas.gorszczyk"
    User = "thomas.gorszczyk"
    TP   = var.tp
  }
}

resource "aws_security_group_rule" "my_security_group_rule_http_out" {
  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.my_security_group.id
}

resource "aws_security_group_rule" "my_security_group_rule_https_out" {
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.my_security_group.id
}

resource "aws_security_group_rule" "my_security_group_rule_http_in" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.my_security_group.id
}

resource "aws_security_group_rule" "my_security_group_rule_ssh_in" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.my_security_group.id
}

resource "aws_key_pair" "admin" {
  key_name = "admin"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDkE/I3ubtNfVEx9MPGvm5Xfzbe/mdM1XAOCRD6bhTIuLKChgnGDv8gop5zC7h/K2pCPtOaVIO7TvWTrtcg6jcCSizQ1G/prJdVhb/YamSCtLVt2Hl39wZ7T+CQ7u+jQi310PlYb4YCjiMnj3VnLZH13bUpmY7xPZJAqgHtOqKmeXgmLUJPI3+xI6T2Mzb2Wkdy3UOWO9zWPJLojmXrRHbWj0obPrdMXC6NrfH2LOCDstM2GzsXCsHBVsrkmbVIglmq3Yz198bzvGkjR3g3SMpC++N0Bon/kj56MAUTempOHBiZXxPLheJ43H4m8g0OJvA9QyWnZhomynFjmHRzFKyN scorpiz@DABEAST"
}

resource "aws_instance" "web" {
  ami                         = "ami-0cdce788baec293cb"
  subnet_id                   = aws_subnet.my_subnet.id
  instance_type               = "t2.micro"
  vpc_security_group_ids      = [aws_security_group.my_security_group.id]
  associate_public_ip_address = true
  key_name = "admin"
  tags = {
    Name = "Nodejs"
    User = "thomas.gorszczyk"
  }
}
