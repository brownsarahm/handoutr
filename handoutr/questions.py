from .utils import load_template_file

class QuestionABC():

    def __init__(self,id,prompt,starter,hint=''):
        '''
        base class for all questions
        '''
        self.template_file = 'question.html'
        self.info = {'id':id,
                     'prompt_text':prompt,
                     'starter':starter,
                     'hint':hint,
                     'function_name':self.function_name}


    def render(self):
        '''
        combine assets together and return the full html
        '''
        #  load the template parts 
        #  the keys here are the items that appear in questions.html
        components = {'question_controller':load_template_file(self.component_dir,'controller.html'),
                      'question_input':load_template_file(self.component_dir,'input.html'),
                      'question_write_in':load_template_file(self.component_dir,'write-in.html'),
                      'question_preview':load_template_file(self.component_dir,'preview.html')}
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
    def __init__(self, id, prompt, starter,hint):
        self.component_dir = 'open'
        self.function_name = 'toggleHTML'
        super().__init__(id, prompt, starter,hint)

class MermaidQuestion(QuestionABC):
    def __init__(self, id, prompt, starter,hint):
        self.component_dir = 'mermaid'
        self.function_name = 'toggleMermaidDiagram'
        super().__init__(id, prompt, starter,hint)