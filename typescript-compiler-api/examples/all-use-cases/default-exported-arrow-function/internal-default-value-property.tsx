const Foo = (props: { one: VoidFunction }) => {
  const { one = () => {} } = props
  return <div>Foo</div>
}

export default Foo
