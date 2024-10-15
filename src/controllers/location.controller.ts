import {repository} from '@loopback/repository';
import {
  del,
  get,
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

  @post('/locations')
  async createLocation(
    @requestBody() locationData: Location,
  ): Promise<Location> {
    return this.locationRepository.create(locationData);
  }


  @get('/locations')
  async findAllLocations(): Promise<Location[]> {
    return this.locationRepository.find({
      include: ['departments'],
    });
  }

  @get('/locations/{id}')
  async findLocationById(
    @param.path.number('id') id: number,
  ): Promise<Location> {
    return this.locationRepository.findById(id, {
      include: ['departments'],
    });
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
