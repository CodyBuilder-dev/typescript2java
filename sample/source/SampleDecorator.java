package org.demo.source;

sampleDecorator(boolean value) 
{
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}
