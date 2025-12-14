// Simple Client-Side Router
export class Router {
    constructor() {
        this.routes = new Map();
        this.defaultRoute = null;
    }

    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    setDefaultRoute(path) {
        this.defaultRoute = path;
    }

    getCurrentRoute() {
        const hash = window.location.hash.slice(1) || this.defaultRoute;
        return hash.split('/')[0]; // Support sub-routes like #locations/123
    }

    getRouteParams() {
        const hash = window.location.hash.slice(1);
        const parts = hash.split('/');
        return parts.slice(1); // Everything after the main route
    }

    handleRoute() {
        const route = this.getCurrentRoute();
        const handler = this.routes.get(route);

        if (handler) {
            handler(this.getRouteParams());
        } else if (this.defaultRoute) {
            // Redirect to default if route not found
            window.location.hash = this.defaultRoute;
        }
    }

    navigateTo(path) {
        window.location.hash = path;
    }
}
