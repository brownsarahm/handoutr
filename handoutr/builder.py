from .questions import OpenQuestion, MermaidQuestion,DateQuestion
from .utils import load_template_file
import click
import yaml

question_type_objs = {'open':OpenQuestion,
                  'mermaid':MermaidQuestion,
                  'date':DateQuestion
}

def parse_question(id, question_segment):
    '''
    parse question formatted markdown into question object

    Parameters
    ----------
    id : string
        identifier for the question that will be the common part among all of the
        related elements for the question
    question_segment : string
        markdown string of the content to be created into the question, must have 
        block delimited with ``` that defines the response with a type that determines
        the type of object on the 
    '''
    # split into the main parts
    prompt_in, type_starter, hint_md = question_segment.split('```')
    # extract the type from the starter
    question_type_in, starter_in = type_starter.split('\n',1)

    # check the hint type
    hint_typer = {'>': 'hidden', '`':'markdown'}
    hint_cleaner = {'hidden':lambda s: s[1:].strip(),
                    'markdown':lambda s: s.replace('`',''),
                    'small':lambda s: s.strip()}
    
    # clean up
    hint_stripped = hint_md.strip()
    
    # clean if not empty, or pass on if empty
    if hint_stripped:
        hint_type = hint_typer.get(hint_stripped[0],'small')
        hint_text = hint_cleaner[hint_type](hint_stripped)
    else:
        hint_type = 'small'
        hint_text = hint_stripped

    # strip others
    prompt = prompt_in.strip()
    starter_text = starter_in.strip()
    question_type = question_type_in.strip()

    # TODO: handle missing qtype
    return question_type_objs[question_type](id,prompt,starter_text,
                                             hint_text,hint_type)



def build_page(source_text,
               id_fmt='q{num}'):
    '''
    build the page for a handoutr

    Parameters
    ----------
    source_text : string
        markdown content to parse/render
    id_fmt : string
        format with {num} in it to how to number question ids
    '''
    # load base templates( these could be changed by settings later)
    page_info = {'about':load_template_file('control','about-main.html'),
                 'save':load_template_file('control','save.html'),
                 'offline':load_template_file('control','offline.html'),
                 'theme_control':load_template_file('control','theme-btngroup.html'),
                 'description':'a handoutr page',
                 'keywords':'page, worksheet',
                 'author':'content author unspecified'}
    # ---------------  parse overall
    if source_text[:3] == '---':
        _, header_yaml, body = source_text.split('---')
        page_info.update(yaml.safe_load(header_yaml))
    else: 
        # TODO: warnings here? 
        body = source_text

    # split body up
    segments = body.split('+++')
    # TODO: make more general, currently cannot hanld eif more than # title is in the first section
    header = segments[0].replace('#','').strip()
    questions_to_parse = segments[1:]

    # add header to info
    page_info.update({'tab_title':header,
              'page_title':header})

    #  build

    # create question objects and render each
    questions = [parse_question(id_fmt.format(num=str(i)),question_md) for 
                 i,question_md in enumerate(questions_to_parse)]
        

    # concatenate questions for body
    page_info['question_html'] = '\n\n<!----question --->\n\n'.join([q.render() for q in questions])

    # concatenate button js 
    page_info['buttons'] = '\n\t'.join(q.button_js() for q in questions)
    
    # load template
    page_template = load_template_file('page.html')

    # fill info into page
    html = page_template.format(**page_info)
    # click.echo(page_info)

    # TODO: drop all lines that are comments with "template"
    return html

