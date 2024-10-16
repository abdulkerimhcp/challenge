import {repository} from '@loopback/repository';
import {
  del,
  get,
  HttpErrors,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {Location} from '../models';
import {LocationRepository} from '../repositories';

export class LocationController {
  constructor(
    @repository(LocationRepository)
    public locationRepository: LocationRepository,
  ) { }

  @post('/locations', {
    responses: {
      '200': {
        description: 'Location successfully created',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Location
            }
          }
        }
      },
      '400': {
        description: 'Bad Request - Invalid input data',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {type: 'string', example: 'Invalid input data'}
              }
            }
          }
        }
      },
      '422': {
        description: 'Unprocessable Entity - Validation failed',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {type: 'string', example: 'Validation error'},
                details: {
                  type: 'array',
                  items: {type: 'string', example: 'Field "name" is required'}
                }
              }
            }
          }
        }
      },
      '500': {
        description: 'Internal Server Error - Something went wrong on the server',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {type: 'string', example: 'Internal server error'}
              }
            }
          }
        }
      }
    }
  })
  async createLocation(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string', description: 'The name of the location'},
              address: {type: 'string', description: 'The address of the location'},
              postalCode: {type: 'string', description: 'Postal code of the location'},
              city: {type: 'string', description: 'City where the location is'},
              country: {type: 'string', description: 'Country where the location is'},
            },
            required: ['name', 'address', 'postalCode', 'city', 'country']
          }
        }
      }
    }) locationData: Location,
  ): Promise<Location> {
    try {
      return this.locationRepository.create(locationData);
    } catch (error) {
      throw new HttpErrors.InternalServerError('Internal server error');
    }
  }



  @get('/locations')
  async findAllLocations(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  @get('/locations/{id}')
  async findLocationById(
    @param.path.number('id') id: number,
  ): Promise<Location> {
    return this.locationRepository.findById(id);
  }

  @patch('/locations/{id}')
  async updateLocationById(
    @param.path.number('id') id: number,
    @requestBody() locationData: Partial<Location>,
  ): Promise<void> {
    await this.locationRepository.updateById(id, locationData);
  }


  @del('/locations/{id}')
  async deleteLocationById(
    @param.path.number('id') id: number,
  ): Promise<void> {
    await this.locationRepository.deleteById(id);
  }
}
