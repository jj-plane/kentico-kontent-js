import { IHttpService } from '@kentico/kontent-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDeliveryClientConfig } from '../config';
import { ElementContracts, ItemContracts, TaxonomyContracts, TypeContracts } from '../data-contracts';
import {
  ContentItem,
  ElementResponses,
  IContentTypeQueryConfig,
  IItemQueryConfig,
  ITaxonomyQueryConfig,
  ItemResponses,
  TaxonomyResponses,
  TypeResponses,
} from '../models';
import { ISDKInfo } from '../models/common/common-models';
import { BaseDeliveryQueryService } from './base-delivery-query.service';
import { IMappingService } from './mapping.service';

export class QueryService extends BaseDeliveryQueryService {

  constructor(
    config: IDeliveryClientConfig,
    httpService: IHttpService,
    sdkInfo: ISDKInfo,
    mappingService: IMappingService
  ) {
    super(config, httpService, sdkInfo, mappingService);
  }

  /**
   * Gets single item from given url
   * @param url Url used to get single item
   * @param queryConfig Query configuration
   */
  getSingleItem<TItem extends ContentItem>(
    url: string,
    queryConfig: IItemQueryConfig
  ): Observable<ItemResponses.ViewContentItemResponse<TItem>> {
    return this.getResponse<ItemContracts.IViewContentItemContract>(url, queryConfig).pipe(
      map(response => {
        return this.mappingService.viewContentItemResponse<TItem>(
          response,
          queryConfig
        );
      })
    );
  }

  /**
   * Gets multiple items from given url
   * @param url Url used to get multiple items
   * @param queryConfig Query configuration
   */
  getMultipleItems<TItem extends ContentItem>(
    url: string,
    queryConfig: IItemQueryConfig
  ): Observable<ItemResponses.ListContentItemsResponse<TItem>> {
    return this.getResponse<ItemContracts.IListContentItemsContract>(url, queryConfig).pipe(
      map(response => {
        return this.mappingService.listContentItemsResponse<TItem>(
          response,
          queryConfig
        );
      })
    );
  }

  /**
   * Gets single content type from given url
   * @param url Url used to get single type
   * @param queryConfig Query configuration
   */
  getSingleType(
    url: string,
    queryConfig: IContentTypeQueryConfig
  ): Observable<TypeResponses.ViewContentTypeResponse> {
    return this.getResponse<TypeContracts.IViewContentTypeContract>(url, queryConfig).pipe(
      map(response => {
        return this.mappingService.viewContentTypeResponse(response);
      })
    );
  }

  /**
   * Gets multiple content types from given url
   * @param url Url used to get multiple types
   * @param queryConfig Query configuration
   */
  getMultipleTypes(
    url: string,
    queryConfig: IContentTypeQueryConfig
  ): Observable<TypeResponses.ListContentTypesResponse> {
    return this.getResponse<TypeContracts.IListContentTypeContract>(url, queryConfig).pipe(
      map(response => {
        return this.mappingService.listContentTypesResponse(response);
      })
    );
  }

  /**
   * Gets single taxonomy from given url
   * @param url Url used to get single taxonomy
   * @param queryConfig Query configuration
   */
  getTaxonomy(
    url: string,
    queryConfig: ITaxonomyQueryConfig
  ): Observable<TaxonomyResponses.ViewTaxonomyGroupResponse> {
    return this.getResponse<TaxonomyContracts.IViewTaxonomyGroupContract>(url, queryConfig).pipe(
      map(response => {
        return this.mappingService.viewTaxonomyGroupResponse(response);
      })
    );
  }

  /**
   * Gets multiple taxonomies from given url
   * @param url Url used to get multiple taxonomies
   * @param queryConfig Query configuration
   */
  getTaxonomies(
    url: string,
    queryConfig: ITaxonomyQueryConfig
  ): Observable<TaxonomyResponses.ListTaxonomyGroupsResponse> {
    return this.getResponse<TaxonomyContracts.IListTaxonomyGroupsContract>(url, queryConfig).pipe(
      map(response => {
        return this.mappingService.listTaxonomyGroupsResponse(response);
      })
    );
  }

  /**
   * Gets single content type element from given url
   * @param url Url used to get single content type element
   * @param queryConfig Query configuration
   */
  getElement(
    url: string,
    queryConfig: ITaxonomyQueryConfig
  ): Observable<ElementResponses.ViewContentTypeElementResponse> {
    return this.getResponse<ElementContracts.IViewContentTypeElementContract>(url, queryConfig).pipe(
      map(response => {
        return this.mappingService.viewContentTypeElementResponse(response);
      })
    );
  }

}
