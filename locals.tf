locals {
  availability_zone = format("%s%s", data.aws_region.current.name, var.availability_zone_suffix)
}
