import CreateAddressDto from './address.dto';

class CreateUserDto {
  public name: string;
  public email: string;
  public password: string;
  public address?: CreateAddressDto;
}

export default CreateUserDto;
