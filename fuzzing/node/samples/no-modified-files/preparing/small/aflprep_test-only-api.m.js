export const isChromiumBased = 'MojoInterfaceInterceptor' in self;
export const isWebKitBased = !isChromiumBased && 'internals' in self;
