export class BizTree {

  tree: Tree;

  constructor(tree: Tree) {
    this.tree = tree;
  }

  public getRootModule(): TreeModule {
    return this.getModule(this.tree.root);
  }

  public getModule(name: string): TreeModule {
    return this.tree.modules[ name ];
  }

  public getChildRouteModules(name: string): TreeModule[] {
    let m: TreeModule = this.getModule(name);

    return Object.keys(m.childRoutes).map((path: string) => {
      return this.getModule(m.childRoutes[path]);
    });
  }

  public getParentModule(name: string): TreeModule {
    return this.getModule(this.getModule(name).parent);
  }
}

export interface Tree {
  root: string;
  modules: TreeModule[];
}

export interface TreeModule {
  parent?: string;
  framers: { [ id: string ]: any };
  childRoutes: { [ path: string ]: string };
}
