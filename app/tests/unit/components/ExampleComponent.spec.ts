import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

/**
 * This is a simple example of a component test using Vitest and Vue Test Utils.
 * This file demonstrates how to test Vue components including events and props.
 */

// Define a simple component to test
const ExampleComponent = defineComponent({
  name: 'ExampleComponent',
  props: {
    message: {
      type: String,
      default: 'Hello'
    }
  },
  emits: ['button-click'],
  template: `
    <div>
      <h1 data-test="title">{{ message }}</h1>
      <button data-test="button" @click="$emit('button-click')">Click me</button>
    </div>
  `
})

// Test suite for the component
describe('ExampleComponent', () => {
  // Test component rendering
  it('renders correctly with default props', () => {
    const wrapper = mount(ExampleComponent)

    expect(wrapper.find('[data-test="title"]').text()).toBe('Hello')
    expect(wrapper.find('[data-test="button"]').exists()).toBe(true)
  })

  // Test props
  it('renders the provided message prop', () => {
    const message = 'Custom message'
    const wrapper = mount(ExampleComponent, {
      props: { message }
    })

    expect(wrapper.find('[data-test="title"]').text()).toBe(message)
  })

  // Test events
  it('emits button-click event when button is clicked', async () => {
    const wrapper = mount(ExampleComponent)

    await wrapper.find('[data-test="button"]').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('button-click')
    expect(wrapper.emitted('button-click')).toHaveLength(1)
  })
})
