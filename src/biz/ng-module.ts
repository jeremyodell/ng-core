import * as _ from 'lodash';

import { CommonModule } from '@angular/common';
import { Component, ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { Data, LoadChildren, Resolve, ResolveData, Route, RouterModule, Routes } from '@angular/router';
// import { MaterialModule } from '@angular/material';

import { BizComponentsModule, BizRootComponent } from './components';
import { BizFramer } from './framer';
import { BizRootComponentConfig } from './root-component-config';
import { BizRouteConfig } from './route-config';

let universalModule: any = BrowserModule;

/**
 *
 */
export function setUniversalModule(module: any): void {
  universalModule = module;
}

/**
 *
 */
export class BizNgModule {

  // ========================================
  // private properties
  // ========================================

  private _children: any[];

  private _childRoutes: {[id: string]: string} = {};

  private _component: any;

  private _containers: any = {};

  private _data: any = {};

  private _importsInChildRoutes: any[] = [];

  private _ngModule: NgModule;

  private _root: boolean = false;

  private _rootComponentConfig: BizRootComponentConfig;

  private _rootComponent: any;

  private _routes: Route[] = [];

  private _routeConfig: BizRouteConfig;

  private isFraming: Boolean = false;

  // ========================================
  // constructor
  // ========================================

  public constructor(ngModule?: NgModule) {
    this.ngModule(ngModule);

    _.defaults(this._ngModule, {
      imports: [],
      declarations: [],
      exports: [],
      providers: [],
      bootstrap: [],
      entryComponents: [],
    });
  }

  // ========================================
  // public methods
  // ========================================

  public ngModule(ngModule?: NgModule): BizNgModule {
    if (this._ngModule) {
      if (ngModule) {
        _.defaults(this._ngModule, ngModule);
        _.each(_.filter(_.keys(ngModule), (key) => { return _.isArray(ngModule[key]); }), (key) => {
          this._ngModule[key] = this._ngModule[key].concat(ngModule[key]);
        });
      }
    } else {
      this._ngModule = ngModule || {};
    }

    return this;
  }

  /**
   * Adds to imports
   * Adds to route
   */
  public children(children: any[]): BizNgModule {
    this._children = children;

    return this;
  }

  public childRoutes(childRoutes: {[id: string]: string}): BizNgModule {
    _.assign(this._childRoutes, childRoutes);

    return this;
  }

  /**
   * Adds to declarations
   * Adds to exports
   * Adds as component on route
   */
  public component(component: any): BizNgModule {
    this._component = component;

    return this;
  }

  /**
   * Adds containers to route data
   * Adds container components to exports and declarations
   */
  public containers(containers: any): BizNgModule {
    _.assign(this._containers, containers);

    return this;
  }

  /**
   * Method for appending data to route
   */
  public data<T>(data: T): BizNgModule {
    _.assign(this._data, data);

    return this;
  }

  public declarations(declarations: any[]): BizNgModule {
    this._ngModule.declarations = this._ngModule.declarations.concat(declarations);

    return this;
  }

  public declarationsAndExports(declarations: any[]): BizNgModule {
    this.declarations(declarations);
    this.exports(exports);

    return this;
  }

  public exports(exports: any[]): BizNgModule {
    this._ngModule.exports = this._ngModule.exports.concat(exports);

    return this;
  }

  public imports(imports: any[]): BizNgModule {
    this._ngModule.imports = this._ngModule.imports.concat(imports);

    return this;
  }

  public importsAndExports(modules: any[]): BizNgModule {
    this.imports(modules);
    this.exports(modules);

    return this;
  }

  /**
   * Modules shared with child routes
   */
  public importsInChildRoutes(imports: any[]): BizNgModule {
    this._importsInChildRoutes = this._importsInChildRoutes.concat(imports);

    return this;
  }

  public providers(providers: any[]): BizNgModule {
    this._ngModule.providers = this._ngModule.providers.concat(providers);

    return this;
  }

  public providersAndExports(providers: any[]): BizNgModule {
    this.providers(providers);
    this.exports(exports);

    return this;
  }

  /**
   * Adds BizContainerComponent to declarations and exports
   * Adds component to bootstrap
   * Defaults route to path '', pathMatch: 'full'
   */
  public root(rootComponent?: any, config?: BizRootComponentConfig): BizNgModule {
    this._root = true;
    this._rootComponentConfig = config || {};
    _.defaults(this._rootComponentConfig, { hybrid: false });
    this._rootComponent = rootComponent || BizRootComponent;

    return this;
  }

  /**
   * Creates Routes array with single route
   * Adds RouterModule.forRoot(routes) or RouterModule.forChild(routes) to imports
   * Adds all resolve services as providers
   */
  public route(route?: Route, config?: BizRouteConfig): BizNgModule {
    this.getOrAddRoute(route);

    if (this._routeConfig) {
      if (config) {
        _.merge(this._routeConfig, config);
      }
    } else {
      this._routeConfig = config || {};
      _.defaults(this._routeConfig, { forRoot: false });
    }

    return this;
  }

  public routes(routes: Route[], config?: BizRouteConfig): BizNgModule {
    _.each(routes, (route) => {
      this.route(route, config);
    });

    return this;
  }

  /**
   * Builds @NgModule() config in the following order:
   * - Defaults
   * - Scaffold
   * - Root
   * - Containers
   * - Component
   * - Route
   */
  public frame(...framers: BizFramer<any, any>[]): NgModule {
    if (this.isFraming) {
      this.buildFramers(framers);
    } else {
      this.isFraming = true;

      this.buildDefaults();
      this.buildFramers(framers);
      this.buildRoot();
      this.buildContainers();
      this.buildComponent();
      this.buildChildren();
      this.buildRoute();

      this.isFraming = false;
    }

    return this._ngModule;
  }

  public build(framers: BizFramer<any, any>[]): NgModule {
    return this.frame.call(this, framers);
  }

  // ========================================
  // private methods
  // ========================================

  private buildDefaults(): void {
    let m: NgModule = this._ngModule;

    this._data = this._data || {};
    m.imports = m.imports || [];
    m.declarations = m.declarations || [];
    m.exports = m.exports || [];
    m.providers = m.providers || [];
    m.bootstrap = m.bootstrap || [];
    m.entryComponents = m.entryComponents || [];
  }

  private buildRoot(): void {
    let m: NgModule = this._ngModule;
    let defaultRoute: any = {
      path: '',
      pathMatch: 'full',
    };

    if (this._root) {
      m.imports = m.imports.concat([
        universalModule,
        FormsModule,
        // MaterialModule.forRoot().
      ]);

      m.declarations = m.declarations.concat([ this._rootComponent ]);
      if (this._rootComponentConfig.hybrid) {
        m.entryComponents = m.entryComponents.concat([ this._rootComponent ]);
      } else {
        m.bootstrap = m.bootstrap.concat([ this._rootComponent ]);
      }

      this.getOrAddRoute(defaultRoute);
    } else {
      m.imports = m.imports.concat([
        CommonModule,
        // MaterialModule,
      ]);
    }

    m.imports = m.imports.concat([ BizComponentsModule ]);
  }

  private buildFramers(framers: BizFramer<any, any>[]): void {
    for (let framer of framers) {
      this.buildFramer(framer);
    }
  }

  private buildFramer(framer: BizFramer<any, any>): void {
    this.imports([ framer.framingModule ]);

    if (framer.defaultConfig) {
      _.defaults(framer.config, framer.defaultConfig);
    }

    if (framer.config && framer.config.helperService) {
      console.log('adding HelperService to provider', framer);
      this.providers([ framer.config.helperService ]);
    }

    if (framer.framerServiceType) {
      console.log('adding FrameService to provider', framer);
      this.providers([ framer.framerServiceType ]);
    }

    framer.frame(this);
  }

  private buildContainers(): void {
    let m: NgModule = this._ngModule;

    if (this._containers) {
      this._data.bizContainers = this._containers;

      let containerComponents = Object.keys(this._containers).map((key: any) => {
        return this._containers[key];
      });

      // m.exports = m.exports.concat(containerComponents);
      // m.declarations = m.declarations.concat(containerComponents);
    }
  }

  private buildChildren(): void {
    let m: NgModule = this._ngModule;

    if (this._children) {
      this.getOrAddRoute({ path: '' }).children = this._children;
    }
  }

  private buildComponent(): void {
    let m: NgModule = this._ngModule;

    if (this._component) {
      m.declarations = m.declarations.concat([ this._component ]);

      this.getOrAddRoute({ path: '' }).component = this._component;
    }
  }

  private buildRoute(): void {
    let m: NgModule = this._ngModule;

    if (this._routes.length > 0) {
      console.log('Routes', this._routes);

      let routing: ModuleWithProviders = this._root || (this._routeConfig && this._routeConfig.forRoot) ?
        RouterModule.forRoot(this._routes, this._routeConfig ? this._routeConfig.extraRootRouterOptions : undefined) :
        RouterModule.forChild(this._routes);

      let routingProviders: any[] = this._routes.map((r) => { return r.resolve ? Object.keys(r.resolve).map((k) => { return r.resolve[k]; }) : []; });

      this.providers(routingProviders);
      this.imports([ routing ]);

      if (this._routeConfig && this._routeConfig.forRoot && !this._root) {
        this.exports([ RouterModule ]); // export RouterModule from AppRoutingModule
      }
    }
  }

  private getOrAddRoute(route: Route = {}): Route {
    _.defaults(route, { path: '' });

    let r = _.find(this._routes, { path: route.path });

    if (r) {
      _.assign(r, route);

      return r;
    } else {
      this._routes.push(route);

      return route;
    }
  }
}
