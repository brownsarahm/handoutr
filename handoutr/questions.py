from .utils import load_template_file

class QuestionABC():
    basepath = 'question'
    template_file = 'question.html'

    def __init__(self,id,prompt,starter,hint_text='',hint_type='small'):
        '''
        base class for all questions
        '''

        
        self.hint_type = hint_type
        self.info = {'id':id,
                     'prompt_text':prompt,
                     'starter':starter,
                     'hint_text':hint_text,
                     'function_name':self.function_name}


    def render(self):
        '''
        combine assets together and return the full html
        '''
        #  load the template parts 
        #  the keys here are the items that appear in questions.html
        components = {'question_controller':load_template_file(self.basepath,self.component_dir,'controller.html'),
                      'question_input':load_template_file(self.basepath,self.component_dir,'input.html'),
                      'question_write_in':load_template_file(self.basepath,self.component_dir,'write-in.html'),
                      'question_preview':load_template_file(self.basepath,self.component_dir,'preview.html'),
                      'question_hint':load_template_file('hint',self.hint_type +'.html')}
        self.info.update(components)

        # insert into question template
        question_template = load_template_file(self.template_file)
        question_rough = question_template.format(**self.info)

        #  fill in details
        question_html = question_rough.format(**self.info)
        return question_html
    
    def button_js(self):
        '''
        create the buttonjs for this question
        '''
        # load template for js
        button_js_template = load_template_file('question.js')
        # fill in and return
        return button_js_template.format(**self.info)
    

class OpenQuestion(QuestionABC):
    def __init__(self, id, prompt, starter,hint,hint_type):
        self.component_dir = 'open'
        self.function_name = 'toggleHTML'
        super().__init__(id, prompt, starter,hint,hint_type)

class MermaidQuestion(QuestionABC):
    def __init__(self, id, prompt, starter,hint,hint_type):
        self.component_dir = 'mermaid'
        self.function_name = 'toggleMermaidDiagram'
        super().__init__(id, prompt, starter,hint,hint_type)

class DateQuestion(QuestionABC):

    template_file = 'question-mini.html'
    def __init__(self, id, prompt, starter,hint,hint_type):
        self.component_dir = 'date'
        self.function_name = 'toggleDate'
        super().__init__(id, prompt, starter,hint,hint_type)