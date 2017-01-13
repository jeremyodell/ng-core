import { globals } from '../../globals';

import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'ts-helpers';

// the polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
// if you are including modules that modify Promise, such as NewRelic,, you must include them before polyfills
if (!globals.disableServerSideRender) require('angular2-universal-polyfills');

// Fix Universal Style
import { NodeDomRootRenderer, NodeDomRenderer } from 'angular2-universal/node';
function renderComponentFix(componentProto: any) {
  return new NodeDomRenderer(this, componentProto, this._animationDriver);
}
NodeDomRootRenderer.prototype.renderComponent = renderComponentFix;
// End Fix Universal Style

import * as path from 'path';
import * as express from 'express';
import * as compression from 'compression';

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';
import { UniversalModule } from 'angular2-universal/node';

// Biz
import { setUniversalModule } from './ng-module';
import { BizConfig } from './config';

setUniversalModule(UniversalModule);

const ROOT = process.cwd();

export class BizServer {

  public app: any;
  public server: any;

  // ========================================
  // constructor
  // ========================================

  public constructor(private config: BizConfig) {
    this.init();
  }

  // ========================================
  // public methods
  // ========================================

  public start(): BizServer {
    this.app.get('*', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let pojo = { status: 404, message: 'No Content' };
      let json = JSON.stringify(pojo, null, 2);
      res.status(404).send(json);
    });

    this.server = this.app.listen(process.env.PORT || 8888, () => {
      console.log(`Listening on: http://localhost:${this.server.address().port}`);
    });

    return this;
  }

  // ========================================
  // private methods
  // ========================================

  private init(): void {
    // enable prod for faster renders
    if (!globals.disableServerSideRender) {
      enableProdMode();
    }

    this.app = express();

    // 1. set up Angular Universal to be the rendering engine for Express
    if (!globals.disableServerSideRender) {
      this.app.engine('.html', createEngine({}));
      this.app.set('views', path.join(ROOT, 'dist'));
      this.app.set('view engine', 'html');
    }

    this.app.use(compression());

    // Serve static files
    this.app.use(express.static(path.join(ROOT, 'public')));
    this.app.use('/public', express.static(path.join(ROOT, 'public')));

    this.app.use('/client', express.static(path.join(ROOT, 'dist', 'client')));

    if (!globals.disableServerSideRender) {
      if (this.config.routes) {
        for (let route of this.config.routes) {
          this.app.get(route, ngPage(this.config.apps.root, 'index', '/'));
        }
      } else {
        this.app.get('/', ngPage(this.config.apps.root, 'index', '/'));
      }
    }

    function ngPage(module: any, htmlPath: string, baseUrl: string): any {
      return (req, res) => {
        res.render(htmlPath, {
          req,
          res,
          // time: true, // use this to determine what part of your app is slow only in development
          preboot: true,
          baseUrl,
          requestUrl: req.originalUrl,
          originUrl: req.hostname,
          ngModule: module,
        });
      };
    }
  }
} 