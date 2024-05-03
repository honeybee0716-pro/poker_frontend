import { FormProvider as Form, UseFormReturn } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
  style?: any;
};

export default function FormProvider({ children, onSubmit, methods, ...other }: Props) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} {...other}>
        {children}
      </form>
    </Form>
  );
}
